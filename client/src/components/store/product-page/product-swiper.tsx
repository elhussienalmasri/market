"use client";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import { cn } from "@/lib/utils";
import { ProductVariantImage } from "@/lib/types";

export default function ProductSwiper({
  images,
  activeImage,
  setActiveImage,
}: {
  images: ProductVariantImage[];
  activeImage: ProductVariantImage | null;
  setActiveImage: Dispatch<SetStateAction<ProductVariantImage | null>>;
}) {
  // If no images are provided, exit early and don't render anything
  if (!images) return;

  return (
    <div className="relative">
      <div className="relative w-full flex flex-col-reverse xl:flex-row gap-2">
        {/* Thumbnails */}
        <div className="flex flex-wrap xl:flex-col gap-3">
          {images.map((img) => (
            <div
              key={img.url}
              className={cn(
                "w-16 h-16 rounded-md grid place-items-center overflow-hidden border border-gray-100 cursor-pointer transition-all duration-75 ease-in",
                {
                  "border-main-primary": activeImage
                    ? activeImage.id === img.id
                    : false,
                }
              )}
              onMouseEnter={() => setActiveImage(img)}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={80}
                height={80}
                className="object-cover rounded-md"
              />
            </div>
          ))}
        </div>
        {/* Image view */}
        <div className="relative rounded-lg overflow-hidden w-full 2xl:h-[600px] 2xl:w-[600px]">
          {/* <ImageZoom
            src={activeImage ? activeImage.url : ""}
            zoom={200}
            className="!w-full rounded-lg"
          /> */}

          <Zoom>
            <img
              src={activeImage ? activeImage.url : ""}
              className="!w-full rounded-lg"
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </Zoom>
        </div>
      </div>
    </div>
  );
}