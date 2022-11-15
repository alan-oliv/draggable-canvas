import styled from 'styled-components'

type CanvasContainerProps = {
  width: number
  height: number
}
const CanvasContainer = styled.div<CanvasContainerProps>`
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
  background-color: #cccccc;
`

type DraggableCanvasProps = {
  width: number
  height: number
}

const DraggableCanvas = ({ width, height }: DraggableCanvasProps) => {
  return (
    <CanvasContainer width={width} height={height}>
      <div>canvas</div>
    </CanvasContainer>
  )
}

export default DraggableCanvas
