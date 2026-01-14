'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SpaImage } from '@/types/spa';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: SpaImage[];
  initialIndex?: number;
}

const ImageGalleryModal = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: ImageGalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Reset to initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setImageErrors(new Set());
    }
  }, [isOpen, initialIndex]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && window.innerWidth >= 768) {
        // Desktop only
        e.preventDefault();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight' && window.innerWidth >= 768) {
        // Desktop only
        e.preventDefault();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasError = imageErrors.has(currentIndex);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
        {/* Mobile: Sticky Close Button */}
        <button
          onClick={onClose}
          className="md:hidden sticky top-0 right-0 z-20 self-end p-4 m-4 bg-white/90 backdrop-blur-md rounded-full border border-stone-200 text-stone-900 shadow-xl"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Desktop: Fixed Index Badge (Top Left) */}
        <div className="hidden md:block absolute top-6 left-6 z-30">
          <div className="px-4 py-2 border border-stone-300 bg-soft-cream text-stone rounded-full text-sm font-semibold">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Desktop: Fixed Close Button (Top Right) */}
        <button
          onClick={onClose}
          className="hidden md:block absolute top-6 right-6 z-30 p-3 rounded-full bg-soft-cream text-stone-400 border border-stone-200"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Mobile: Scrollable Image List */}
        <div className="md:hidden flex-grow overflow-y-auto px-4 pt-8 pb-16 space-y-4">
          {images.map((image, index) => {
            const hasImageError = imageErrors.has(index);
            return (
              <div
                key={index}
                className="relative w-full"
                style={{ minHeight: '200px' }}
              >
                {!hasImageError ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain rounded-lg"
                    quality={85}
                    loading="lazy"
                    sizes="100vw"
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="w-full h-[400px] flex items-center justify-center text-stone-400 bg-stone-100 rounded-lg">
                    <span className="text-sm">Image not available</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop: Single Image View with Navigation */}
        <div className="hidden md:flex flex-grow items-center justify-center p-8 md:p-16 relative min-h-0">
          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 md:left-6 p-4 bg-soft-cream backdrop-blur-md rounded-full border border-stone-200 text-stone-900 shadow-xl z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image Container */}
          <div className="relative max-w-[1200px] max-h-[800px] w-full h-full min-h-0">
            {!hasError && currentImage ? (
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                className="block w-full h-full object-contain rounded-lg"
                quality={85}
                loading={currentIndex === initialIndex ? 'eager' : 'lazy'}
                sizes="(max-width: 1200px) 100vw, 1200px"
                onError={() => handleImageError(currentIndex)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100 rounded-lg">
                <span className="text-sm">Image not available</span>
              </div>
            )}
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 md:right-6 p-4 bg-soft-cream backdrop-blur-md rounded-full border border-stone-200 text-stone-900 shadow-xl z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryModal;
