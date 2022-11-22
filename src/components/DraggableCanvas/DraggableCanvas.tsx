import {
  Children,
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { ASSETS_URL } from '../../constants';
import { CanvasImage, DraggableCanvasImageProps, RawImage } from './Image/DraggableCanvasImage';

type CanvasContainerProps = {
  width: number;
  height: number;
};

const CanvasContainer = styled.div<CanvasContainerProps>`
  position: relative;
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
`;

type DraggableCanvasProps = {
  width?: number;
  height?: number;
  children: ReactElement<DraggableCanvasImageProps> | ReactElement<DraggableCanvasImageProps>[];
  dragSpeed?: 1 | 2 | 3 | 4 | 5;
  initialPreloadQuantity?: number;
  preloadQuantity?: number;
};

const DraggableCanvas = ({
  width = 300,
  height = 150,
  children,
  dragSpeed = 1,
  initialPreloadQuantity = 2,
  preloadQuantity = 1,
}: DraggableCanvasProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasLoader, setCanvasLoader] = useState<HTMLImageElement | null>(null);
  const [loadedImages, setLoadedImages] = useState<CanvasImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);

  const images = Children.toArray(children);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      return;
    }

    images.forEach((_, index) => {
      canvasContext.fillStyle = '#ffffff';
      canvasContext.fillRect(index * width, 0, width, height);

      const canvasLoaderImage = canvasLoader as HTMLImageElement;
      canvasContext.drawImage(
        canvasLoaderImage,
        index * width + width / 2 - canvasLoaderImage.width / 2,
        height / 2 - canvasLoaderImage.height / 2,
        canvasLoaderImage.width,
        canvasLoaderImage.height,
      );
    });
  }, [height, images, width, canvasLoader]);

  const drawImages = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      return;
    }

    loadedImages.forEach((image) => {
      const { id, imageElement, ratio, horizontalCenter, verticalCenter } = image;

      canvasContext.drawImage(
        imageElement,
        0,
        0,
        imageElement.width,
        imageElement.height,
        id * width + horizontalCenter,
        verticalCenter,
        imageElement.width * ratio,
        imageElement.height * ratio,
      );
    });
  }, [loadedImages, width]);

  const lazyLoadImages = useCallback(
    (quantity: number, startingFrom: number) => {
      if (!loading) {
        const imageQueue: Promise<CanvasImage>[] = [];
        const imageQuantity = Array.from(
          { length: quantity },
          (_, index) => (index = index + startingFrom),
        );

        const rawImages: RawImage[] = [];

        imageQuantity.map((imageIndex) => {
          if (images[imageIndex]) {
            rawImages.push({
              id: imageIndex,
              element: images[imageIndex] as ReactElement,
            });
          }
        });

        rawImages.forEach(({ id, element }) => {
          const DraggableCanvasImage = element.type as FunctionComponent;

          const imageElement = DraggableCanvasImage({
            id: id,
            src: element.props.src,
            canvasWidth: width,
            canvasHeight: height,
          });

          const imagePromise = imageElement?.props['data-promise'];
          imageQueue.push(imagePromise);
        });

        Promise.all(imageQueue).then((images) => {
          setLoadedImages([...loadedImages, ...images]);
          setLoading(false);
        });
      } else {
        drawImages();
      }
    },
    [drawImages, height, images, loadedImages, loading, setLoadedImages, setLoading, width],
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvasContext = canvasRef.current?.getContext('2d');

      if (canvasContext) {
        const xDiff = e.movementX * dragSpeed;

        const transformedMatrix = Math.abs(canvasContext.getTransform().e);
        const allImagesWidth = (images.length - 1) * width;
        const isfirstImageLimit = transformedMatrix - xDiff < 0;
        const isLastImageLimit = transformedMatrix - xDiff >= allImagesWidth;

        if (isfirstImageLimit || isLastImageLimit) {
          return;
        }

        canvasContext.translate(xDiff, 0);
        renderCanvas();

        images.forEach((_, currentIndex) => {
          const nextIndex = currentIndex + 1;

          const initialX = width * currentIndex;
          const finalX = width * nextIndex;
          const dragPosition = transformedMatrix;

          const imageIndexIds = [nextIndex];

          if (dragPosition >= initialX && dragPosition <= finalX) {
            const isLoaded =
              loadedImages.length > 0 &&
              loadedImages.find((image) => imageIndexIds.includes(image.id));

            if (isLoaded) {
              drawImages();
            } else {
              lazyLoadImages(preloadQuantity, currentIndex + 1);
              setLoading(true);
            }
          }
        });
      }
    },
    [
      dragSpeed,
      drawImages,
      images,
      lazyLoadImages,
      loadedImages,
      preloadQuantity,
      renderCanvas,
      width,
    ],
  );

  useEffect(() => {
    if (canvasRef && loadedImages.length > 0) {
      drawImages();
    }
  }, [loadedImages, drawImages]);

  useEffect(() => {
    if (loadedImages.length === 0) {
      return;
    }

    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', () => setDragging(false));
      document.body.classList.add('dragging-cursor');
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', () => setDragging(false));
      document.body.classList.remove('dragging-cursor');
    };
  }, [dragging, onMouseMove, loadedImages]);

  useEffect(() => {
    if (!canvasLoader) {
      const canvasLoaderImage = new Image();
      canvasLoaderImage.src = `${ASSETS_URL}/loading.png`;
      canvasLoaderImage.onload = () => {
        setCanvasLoader(canvasLoaderImage);
      };
      return;
    }

    if (canvasRef && canvasLoader && loadedImages.length === 0) {
      renderCanvas();
      lazyLoadImages(initialPreloadQuantity, 0);
    }
  }, [canvasRef, canvasLoader, renderCanvas, initialPreloadQuantity, lazyLoadImages, loadedImages]);

  return (
    <CanvasContainer width={width} height={height}>
      <canvas ref={canvasRef} width={width} height={height} onMouseDown={() => setDragging(true)} />
    </CanvasContainer>
  );
};

export default DraggableCanvas;
