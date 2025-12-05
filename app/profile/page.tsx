'use client';

import { useEffect, useState } from 'react';
import { getLikedArtworks, type LikedArtwork } from '@/lib/likes';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const [likedArtworks, setLikedArtworks] = useState<LikedArtwork[]>([]);
  const username = "artlover123"; // TODO: Get from auth later

  useEffect(() => {
    setLikedArtworks(getLikedArtworks());
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{username}</h1>
        <p className="text-gray-600">Liked Artworks ({likedArtworks.length})</p>
      </div>

      {likedArtworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {likedArtworks.map((artwork) => (
            <Link
              key={artwork.id}
              href={`/details/${artwork.id}?type=${artwork.type}`}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-green-500 transition-all duration-200 hover:shadow-xl"
            >
              {artwork.imageUrl ? (
                <div className="relative h-56 bg-gray-100">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-56 bg-gray-100 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {artwork.title}
                </h3>
                {artwork.artist && (
                  <p className="text-sm text-gray-600">{artwork.artist}</p>
                )}
                {artwork.dated && (
                  <p className="text-sm text-gray-500">{artwork.dated}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-gray-500 text-lg">No liked artworks yet</p>
          <p className="text-gray-400 mt-2">Start exploring and like some artworks!</p>
        </div>
      )}
    </div>
  );
}