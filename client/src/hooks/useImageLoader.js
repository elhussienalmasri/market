"use client";
import { useState, useEffect } from "react";

export default function useImageLoader(src, onError) {
  const [imgData, setImgData] = useState(null);
  const [error, setError] = useState(false);
  const [naturalWidth, setNaturalWidth] = useState(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImgData(src); // return URL string
      setNaturalWidth(img.naturalWidth);
    };

    img.onerror = (e) => {
      setError(true);
      if (onError) onError(e);
    };
  }, [src]);

  return { imgData, error, naturalWidth };
}
