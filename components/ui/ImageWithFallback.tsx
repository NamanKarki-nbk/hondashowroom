"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  priority?: boolean;
}

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  width,
  height,
  fallbackSrc = "/inventory/honda-dio-bs6-110.png",
  priority = false,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc && fallbackSrc !== imgSrc) {
        setImgSrc(fallbackSrc);
      }
    }
  };

  if (hasError && !fallbackSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 rounded-xl p-6 text-center border border-dashed border-gray-400 dark:border-gray-700 ${className}`}
        style={{ width: width || "100%", height: height || "200px" }}
      >
        <span className="font-bold text-sm tracking-wider uppercase mb-1">
          [Image Placeholder: {alt}]
        </span>
        <span className="text-xs text-gray-400">Asset asset pending</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
