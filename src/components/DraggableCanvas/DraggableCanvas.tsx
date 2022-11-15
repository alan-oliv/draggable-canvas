import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

type CanvasContainerProps = {
  width: number;
  height: number;
};
const CanvasContainer = styled.div<CanvasContainerProps>`
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
  background-color: #cccccc;
`;

type DraggableCanvasProps = {
  width: number;
  height: number;
};

const DraggableCanvas = ({ width, height }: DraggableCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = [{ color: 'blue' }, { color: 'red' }, { color: 'green' }];

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
      ctx.fillStyle = image.color;
      ctx.fillRect(index * width, 0, width, height);
    });
  }, []);

  useEffect(() => {
    if (canvasRef) {
      draw();
    }
  }, [canvasRef]);

  return (
    <CanvasContainer width={width} height={height}>
      <canvas ref={canvasRef} width={width} height={height} />
    </CanvasContainer>
  );
};

export default DraggableCanvas;
