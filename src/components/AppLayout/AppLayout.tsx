import styled from 'styled-components';
import DraggableCanvas from '../DraggableCanvas';
import DraggableCanvasImage from '../DraggableCanvas/Image';

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const AppLayout = (): JSX.Element => {
  return (
    <CenterContainer>
      <DraggableCanvas width={640} height={400}>
        <DraggableCanvasImage src='http://challenge.publitas.com/images/0.jpg' />
        <DraggableCanvasImage src='http://challenge.publitas.com/images/1.jpg' />
        <DraggableCanvasImage src='http://challenge.publitas.com/images/2.jpg' />
        <DraggableCanvasImage src='http://challenge.publitas.com/images/3.jpg' />
      </DraggableCanvas>
    </CenterContainer>
  );
};

export default AppLayout;
