export type DraggableCanvasImageProps = {
  src: string;
  canvas?: number;
};

const DraggableCanvasImage = ({ src }: DraggableCanvasImageProps): JSX.Element => {
  const image = new Image();
  image.src = src;

  const imagePromise = new Promise<HTMLImageElement>((resolve) => {
    image.onload = () => {
      resolve(image);
    };
  });

  return <div data-image={imagePromise} />;
};

export default DraggableCanvasImage;
