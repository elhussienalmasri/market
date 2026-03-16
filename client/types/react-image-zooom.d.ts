// react-image-zooom.d.ts
declare module "react-image-zooom" {
  import { FC } from "react";

  interface ImageZoomProps {
    className?: string; // Optional className for styling
    _id?: string; // Optional id for the image element
    src: string; // The image URL, required
    zoom?: number; // Optional zoom factor, default is 200
    alt?: string; 
    width?: string | number; 
    height?: string | number; 
  }

  // Declare the component and its props
  const ImageZoom: FC<ImageZoomProps>;

  export default ImageZoom;
}