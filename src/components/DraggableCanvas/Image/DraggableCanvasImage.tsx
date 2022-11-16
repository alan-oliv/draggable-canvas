export type DraggableCanvasImageProps = {
  src: string;
  canvasWidth?: number;
  canvasHeight?: number;
};

export type CanvasImage = {
  imageElement: HTMLImageElement;
  ratio: number;
  horizontalCenter: number;
  verticalCenter: number;
};

const DraggableCanvasImage = ({
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
