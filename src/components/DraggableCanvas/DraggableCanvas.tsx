import { useRef } from 'react';
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

  return (
    <CanvasContainer width={width} height={height}>
      <canvas ref={canvasRef} width={width} height={height} />
    </CanvasContainer>
  );
};

export default DraggableCanvas;
