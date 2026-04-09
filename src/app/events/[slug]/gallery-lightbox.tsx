'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface GalleryImage {
  url: string;
  alt: string;
}

interface EventGalleryLightboxProps {
  images: GalleryImage[];
}

export default function EventGalleryLightbox({ images }: EventGalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % images.length);
  }, [activeIndex, images.length]);

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goPrev();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, closeLightbox, goNext, goPrev]);

  if (!images || images.length === 0) {
    return null;
  }

  const activeImage = activeIndex !== null ? images[activeIndex] : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-toko-gray-900 mb-6">Event Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="group relative aspect-video overflow-hidden rounded-lg border border-toko-gray-200 hover:border-toko-green transition-all duration-300 hover:shadow-toko-lg"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeImage && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-3 py-6 md:px-8"
          role="dialog"
          aria-modal="true"
          aria-label="Event image lightbox"
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            aria-label="Close gallery"
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/50 p-2 text-white transition-colors hover:bg-black/70 md:left-5"
            aria-label="Previous image"
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/50 p-2 text-white transition-colors hover:bg-black/70 md:right-5"
            aria-label="Next image"
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="w-full max-w-5xl">
            <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-black">
              <Image
                src={activeImage.url}
                alt={activeImage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-contain"
                priority
              />
            </div>

            <div className="rounded-lg border border-white/20 bg-black/50 p-4 text-center backdrop-blur">
              <p className="text-sm text-white/80">{activeImage.alt}</p>
              <p className="mt-2 text-xs text-white/60">
                Image {activeIndex + 1} of {images.length} — Use arrow keys or click buttons to navigate
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
