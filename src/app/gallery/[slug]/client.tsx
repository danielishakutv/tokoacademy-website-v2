'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GalleryAlbum } from '@/lib/wordpress';

/**
 * One album.
 *
 * Same three repairs as the board it came from: the stock Tailwind greys are
 * now tokens that follow the theme, `pt-20` no longer hides the top of the page
 * under a 108px header, and the lightbox can be closed with a key and stops
 * the page scrolling behind it.
 */

type AlbumClientProps = {
  album: GalleryAlbum;
};

export default function AlbumClient({ album }: AlbumClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) =>
        prev === album.images.length - 1 ? 0 : prev! + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? album.images.length - 1 : prev! - 1
      );
    }
  };

  const shareAlbum = () => {
    if (navigator.share) {
      navigator.share({
        title: album.title,
        text: album.description,
        url: album.shareUrl,
      }).catch(() => {
        copyToClipboard(album.shareUrl);
      });
    } else {
      copyToClipboard(album.shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const lightboxOpen = selectedImageIndex !== null;

  useEffect(() => {
    if (selectedImageIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') nextImage();
      if (event.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageIndex]);

  /*
   * Separate from the key handler: that one re-runs on every photograph, and a
   * scroll lock inside it would save its own `hidden` as the value to restore,
   * leaving the page frozen after the lightbox closed.
   */
  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-12 md:pt-40 md:pb-16">
        <div className="aurora" aria-hidden />
        <div className="section-container relative">
          <Link href="/gallery" className="link-hover inline-flex items-center text-sm font-semibold text-ink-muted">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Gallery
          </Link>

          <h1 className="mt-6">{album.title}</h1>
          <p className="prose-measure mt-4 text-lg text-ink-muted">{album.description}</p>
          <p className="mt-2 text-sm text-ink-subtle">
            {album.date} • {album.images.length} {album.images.length === 1 ? 'photo' : 'photos'}
          </p>

          <button onClick={shareAlbum} className="btn-secondary mt-7">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Album
          </button>
        </div>
      </section>

      {/* Photo grid. Two across on a phone rather than one: these are square
          crops, and one per row means a great deal of scrolling for very
          little. */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {album.images.map((image, index) => (
              <button
                type="button"
                key={index}
                onClick={() => openLightbox(index)}
                aria-label={`Open photo ${index + 1} of ${album.images.length}`}
                className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-surface-sunken transition-colors hover:border-brand"
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                  <svg className="h-10 w-10 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox. Fixed black in both themes — a photograph wants a dark room. */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={`${album.title} photograph viewer`}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition-colors hover:bg-black/70"
            aria-label="Close lightbox"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {album.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition-colors hover:bg-black/70 md:left-5"
                aria-label="Previous image"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition-colors hover:bg-black/70 md:right-5"
                aria-label="Next image"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-8">
            <div className="relative h-[62vh] w-full max-w-6xl sm:h-[75vh]">
              <Image
                src={album.images[selectedImageIndex].url}
                alt={album.images[selectedImageIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <p className="mt-4 text-center text-white/70">
              {selectedImageIndex + 1} / {album.images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
