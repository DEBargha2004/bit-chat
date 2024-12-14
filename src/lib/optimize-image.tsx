export default function optimizeImage(url: string) {
  const image = new Image();
  image.src = url;

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext("2d");
  ctx?.drawImage(image, 0, 0);

  return canvas.toDataURL("image/jpeg", 0.5);
}
