import styled from 'styled-components';
import DraggableCanvas from '../DraggableCanvas';
import DraggableCanvasImage from '../DraggableCanvas/Image';
import { ASSETS_URL } from '../../constants';

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
        <DraggableCanvasImage src={`${ASSETS_URL}/images/0.jpg`} />
        <DraggableCanvasImage src={`${ASSETS_URL}/images/1.jpg`} />
        <DraggableCanvasImage src={`${ASSETS_URL}/images/2.jpg`} />
        <DraggableCanvasImage src={`${ASSETS_URL}/images/3.jpg`} />
      </DraggableCanvas>
    </CenterContainer>
  );
};

export default AppLayout;
