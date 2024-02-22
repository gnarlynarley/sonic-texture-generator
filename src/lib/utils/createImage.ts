export default function createImage(src: string) {
  const image = document.createElement('img');
  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error('Something went wrong with retrieving the image.'));
    };
    image.src = src;
  });
}
