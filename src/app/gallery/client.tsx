'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryAlbum } from '@/lib/wordpress';

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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-toko-green to-toko-blue text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-lg md:text-xl opacity-90">
            Explore our collection of memorable moments and events
          </p>
        </div>
      </div>

      {/* Albums Grid */}
      <div className="container mx-auto px-4 py-12">
        {albums.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No albums available at the moment.</p>
            <p className="text-gray-500 mt-2">Check back soon for new photos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.slug}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
              >
                {/* Album Cover */}
                <div 
                  className="relative h-64 bg-gray-200 overflow-hidden"
                  onClick={() => openAlbum(album)}
                >
                  {album.images[0] && (
                    <Image
                      src={album.images[0].url}
                      alt={album.images[0].alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View Album
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                    {album.images.length} {album.images.length === 1 ? 'photo' : 'photos'}
                  </div>
                </div>

                {/* Album Info */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{album.title}</h2>
                  <p className="text-sm text-gray-500 mb-3">{album.date}</p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{album.description}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openAlbum(album)}
                      className="flex-1 bg-toko-green text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                    >
                      View Album
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareAlbum(album);
                      }}
                      className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                      title="Share album"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Lightbox Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeAlbum}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {selectedAlbum.images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
              aria-label="Previous image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {selectedAlbum.images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
              aria-label="Next image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
            <div className="relative w-full h-[70vh] max-w-6xl">
              <Image
                src={selectedAlbum.images[selectedImageIndex].url}
                alt={selectedAlbum.images[selectedImageIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Image Info */}
            <div className="text-white text-center mt-4 max-w-3xl">
              <h3 className="text-2xl font-bold mb-2">{selectedAlbum.title}</h3>
              <p className="text-gray-300 mb-2">{selectedAlbum.description}</p>
              <p className="text-sm text-gray-400">
                {selectedImageIndex + 1} / {selectedAlbum.images.length}
              </p>
            </div>

            {/* Share Button */}
            <button
              onClick={() => shareAlbum(selectedAlbum)}
              className="mt-4 bg-toko-green text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Album
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
