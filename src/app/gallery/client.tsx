'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { GalleryAlbum } from '@/lib/wordpress';

/**
 * The album board.
 *
 * Besides the colour migration — this page was still on stock Tailwind greys,
 * which are not our greys and do not move with the theme — two things were
 * actually broken.
 *
 * **`pt-20` cleared 80 pixels for a header that is 108.** The top of the page
 * was underneath it on every desktop screen.
 *
 * **The lightbox could not be closed with a key.** It trapped a keyboard user
 * in a full-screen overlay whose only exit was a mouse. Escape now closes it,
 * the arrow keys move through the album, and the page behind it stops
 * scrolling while it is open.
 */

type GalleryClientProps = {
  albums: GalleryAlbum[];
};

export default function GalleryClient({ albums }: GalleryClientProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openAlbum = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    setSelectedImageIndex(0);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedAlbum) {
      setSelectedImageIndex((prev) =>
        prev === selectedAlbum.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedAlbum) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? selectedAlbum.images.length - 1 : prev - 1
      );
    }
  };

  const shareAlbum = (album: GalleryAlbum) => {
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

  const lightboxOpen = selectedAlbum !== null;

  useEffect(() => {
    if (!selectedAlbum) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAlbum();
      if (event.key === 'ArrowRight') nextImage();
      if (event.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlbum, selectedImageIndex]);

  /*
   * Kept apart from the key handler deliberately. That effect re-runs every
   * time the photograph changes, and a scroll lock inside it would read back
   * its own `hidden` as the "previous" value on the second run — so closing
   * the lightbox would restore `hidden` and leave the page frozen. This one
   * only fires when the lightbox opens and closes.
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
      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-14 md:pt-40 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative">
          <div className="max-w-3xl reveal">
            <p className="eyebrow">Gallery</p>
            <h1 className="mt-3">Photo Gallery</h1>
            <p className="prose-measure mt-5 text-lg text-ink-muted md:text-xl">
              Explore our collection of memorable moments and events.
            </p>
          </div>
        </div>
      </section>

      {/* Albums */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          {albums.length === 0 ? (
            <div className="card p-8 text-center sm:p-10">
              <h2>No albums available at the moment.</h2>
              <p className="mt-3 text-ink-muted">Check back soon for new photos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => (
                <div key={album.slug} className="card group flex flex-col overflow-hidden p-0 reveal">
                  {/* Cover */}
                  <button
                    type="button"
                    onClick={() => openAlbum(album)}
                    aria-label={`View the ${album.title} album`}
                    className="relative block h-56 w-full overflow-hidden bg-surface-sunken sm:h-64"
                  >
                    {album.images[0] && (
                      <Image
                        src={album.images[0].url}
                        alt={album.images[0].alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white">
                      {album.images.length} {album.images.length === 1 ? 'photo' : 'photos'}
                    </span>
                  </button>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h2>{album.title}</h2>
                    <p className="mt-1 text-sm text-ink-subtle">{album.date}</p>
                    <p className="mt-3 line-clamp-2 flex-1 text-ink-muted">{album.description}</p>

                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openAlbum(album)}
                        className="btn-primary flex-1 px-4 py-2.5"
                      >
                        View Album
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareAlbum(album);
                        }}
                        className="btn-secondary size-11 shrink-0 px-0 py-0"
                        aria-label={`Share the ${album.title} album`}
                        title="Share album"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox. Fixed black in both themes — a photograph wants a dark room,
          and the controls on it are white for the same reason. */}
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedAlbum.title} album`}
        >
          <button
            onClick={closeAlbum}
            className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition-colors hover:bg-black/70"
            aria-label="Close lightbox"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {selectedAlbum.images.length > 1 && (
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
            <div className="relative h-[55vh] w-full max-w-6xl sm:h-[65vh]">
              <Image
                src={selectedAlbum.images[selectedImageIndex].url}
                alt={selectedAlbum.images[selectedImageIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <div className="mt-4 max-w-3xl text-center text-white">
              <h3 className="text-white">{selectedAlbum.title}</h3>
              <p className="mt-2 text-sm text-white/75">{selectedAlbum.description}</p>
              <p className="mt-2 text-sm text-white/60">
                {selectedImageIndex + 1} / {selectedAlbum.images.length}
              </p>
            </div>

            <button
              onClick={() => shareAlbum(selectedAlbum)}
              className="btn-primary mt-5"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Album
            </button>
          </div>
        </div>
      )}
    </>
  );
}
