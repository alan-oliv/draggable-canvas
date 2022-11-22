import styled from 'styled-components';
import { ASSETS_URL } from '../../constants';
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
  const imagesFromApi: string[] = [
    `${ASSETS_URL}/images/0.jpg`,
    `${ASSETS_URL}/images/1.jpg`,
    `${ASSETS_URL}/images/2.jpg`,
    `${ASSETS_URL}/images/3.jpg`,
  ];

  return (
    <CenterContainer>
      <DraggableCanvas
        width={640}
        height={400}
        initialPreloadQuantity={2}
        preloadQuantity={1}
        dragSpeed={2}
      >
        {imagesFromApi.map((url, index) => (
          <DraggableCanvasImage key={`image-${index}`} src={url} />
        ))}
      </DraggableCanvas>
    </CenterContainer>
  );
};

export default AppLayout;
