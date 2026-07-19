'use client';
import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'; // Reliable fallback image (a generic travel landscape)

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

export default function SafeImage({ src, fallbackSrc = FALLBACK_IMAGE, alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  // If no source is provided at all, immediately use fallback
  const imageSrc = !src || src.trim() === '' ? fallbackSrc : (error ? fallbackSrc : src);

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt || 'Image'}
      onError={() => {
        if (!error) {
          setError(true);
        }
      }}
    />
  );
}
