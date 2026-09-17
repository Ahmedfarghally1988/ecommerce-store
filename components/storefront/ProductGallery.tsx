"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: { id: string; url: string; alt: string | null; sortOrder: number }[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-[500px] mx-auto w-full">
      <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].alt || 'Product Image'}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
        />
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === index ? 'border-gray-500' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || 'Thumbnail'}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
