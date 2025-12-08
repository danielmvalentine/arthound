'use client';

import { useState, useEffect } from 'react';
import { toggleLike, isArtworkLiked, type LikedArtwork } from '@/lib/likes';

interface LikeButtonProps {
  artwork: LikedArtwork;
}

export default function LikeButton({ artwork }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLiked(isArtworkLiked(artwork.id));
  }, [artwork.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Don't navigate to details page
    const newLikedState = toggleLike(artwork);
    setLiked(newLikedState);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleLike}
      className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
      title={liked ? 'Unlike' : 'Like'}
    >
      <svg 
        className={`w-6 h-6 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}