import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CanvasImage } from './Image/DraggableCanvasImage';

type CanvasContainerProps = {
  width: number;
  height: number;
  loadingCanvas: boolean;
};

const CanvasContainer = styled.div<CanvasContainerProps>`
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;

  ${(p) =>
    p.loadingCanvas &&
    `
      background-image: url('./loading.gif');
      background-repeat: no-repeat;
      background-position: center;
    `}
`;

type DraggableCanvasProps = {
  width?: number;
  height?: number;
  children: React.ReactNode;
  dragSpeed?: 1 | 2 | 3 | 4 | 5;
};

const DraggableCanvas = ({
  width = 300,
  height = 150,
  children,
  dragSpeed = 1,
}: DraggableCanvasProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<CanvasImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dragging, setDragging] = useState<boolean>(false);

  const load = useCallback(() => {
    if (children) {
      const imageQueue: Promise<CanvasImage>[] = [];
      const childrens = Array.isArray(children) ? children : [children];

      childrens.forEach((element) => {
        const imageElement = element.type({
          src: element.props.src,
          canvasWidth: width,
          canvasHeight: height,
        });

        const imagePromise = imageElement.props['data-promise'];
        imageQueue.push(imagePromise);
      });

      Promise.all(imageQueue).then((images) => {
        setImages(images);
        setLoading(false);
      });
    }
  }, [children]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      return;
    }

    images.forEach((image, index) => {
      const { imageElement, ratio, horizontalCenter, verticalCenter } = image;

      canvasContext.fillStyle = '#ffffff';
      canvasContext.fillRect(index * width, 0, width, height);
      canvasContext.drawImage(
        imageElement,
        0,
        0,
        imageElement.width,
        imageElement.height,
        index * width + horizontalCenter,
        verticalCenter,
        imageElement.width * ratio,
        imageElement.height * ratio,
      );
    });
  }, [images]);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvasContext = canvasRef.current?.getContext('2d');

      if (canvasContext) {
        const xDiff = e.movementX * dragSpeed;

        const transformedMatrix = canvasContext.getTransform();
        const allImagesWidth = (images.length - 1) * width;
        const isfirstImageLimit = transformedMatrix.e + xDiff > 0;
        const isLastImageLimit = transformedMatrix.e + xDiff < -allImagesWidth;

        if (isfirstImageLimit || isLastImageLimit) {
          return;
        }

        canvasContext.clearRect(0, 0, width, height);
        canvasContext.translate(xDiff, 0);

        draw();
      }
    },
    [draw, images],
  );

  useEffect(() => {
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
  }, [dragging, onMouseMove]);

  useEffect(() => {
    if (canvasRef && !loading) {
      draw();
    } else {
      load();
    }
  }, [canvasRef, loading, draw, load]);

  return (
    <CanvasContainer width={width} height={height} loadingCanvas={loading}>
      <canvas ref={canvasRef} width={width} height={height} onMouseDown={() => setDragging(true)} />
    </CanvasContainer>
  );
};

export default DraggableCanvas;
