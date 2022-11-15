import styled from 'styled-components'
import DraggableCanvas from '../DraggableCanvas'

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const AppLayout = () => {
  return (
    <CenterContainer>
      <DraggableCanvas width={640} height={400} />
    </CenterContainer>
  )
}

export default AppLayout
