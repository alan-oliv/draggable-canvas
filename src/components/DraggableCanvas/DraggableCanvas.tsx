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
};

const DraggableCanvas = ({
  width = 300,
  height = 150,
  children,
}: DraggableCanvasProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<CanvasImage[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    images.forEach((image, index) => {
      const { imageElement, ratio, horizontalCenter, verticalCenter } = image;
      ctx.fillRect(index * width, 0, width, height);
      ctx.drawImage(
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

  useEffect(() => {
    if (canvasRef && !loading) {
      draw();
    } else {
      load();
    }
  }, [canvasRef, loading, draw, load]);

  return (
    <CanvasContainer width={width} height={height} loadingCanvas={loading}>
      <canvas ref={canvasRef} width={width} height={height} />
    </CanvasContainer>
  );
};

export default DraggableCanvas;
