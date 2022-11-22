import { ReactElement } from 'react';

export type DraggableCanvasImageProps = {
  id?: number;
  src: string;
  canvasWidth?: number;
  canvasHeight?: number;
};

export type CanvasImage = {
  id: number;
  imageElement: HTMLImageElement;
  ratio: number;
  horizontalCenter: number;
  verticalCenter: number;
};

export type RawImage = {
  id: number;
  element: ReactElement<DraggableCanvasImageProps>;
};

const DraggableCanvasImage = ({
  id = 0,
  src,
  canvasWidth = 300,
  canvasHeight = 150,
}: DraggableCanvasImageProps): JSX.Element => {
  const image = new Image();
  image.src = src;

  const imagePromise = new Promise<CanvasImage>((resolve) => {
    image.onload = () => {
      const ratio = Math.min(canvasWidth / image.width, canvasHeight / image.height);
      const horizontalCenter = (canvasWidth - image.width * ratio) / 2;
      const verticalCenter = (canvasHeight - image.height * ratio) / 2;

      const imageProperties: CanvasImage = {
        id,
        imageElement: image,
        ratio,
        horizontalCenter,
        verticalCenter,
      };

      resolve(imageProperties);
    };
  });

  return <div data-promise={imagePromise} />;
};

export default DraggableCanvasImage;
