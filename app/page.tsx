'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLikedArtworks, type LikedArtwork } from '@/lib/likes';
import { getMyCollections } from '@/lib/backend';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface Collection {
  _id: string;
  name: string;
  description?: string;
  artworks: any[];
  createdAt: string;
}

interface Note {
  _id: string;
  userId: string;
  targetType: 'artwork' | 'exhibition';
  targetId: string;
  content: string;
  createdAt: string;
}

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userCollections, setUserCollections] = useState<Collection[]>([]);
  const [likedArtworks, setLikedArtworks] = useState<LikedArtwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        // If user is logged in
        if (userId && username) {
          setCurrentUser({
            _id: userId,
            username: username,
            email: '',
            role: role || 'Art Enthusiast'
          });

          // Fetch user's collections
          const collections = await getMyCollections(userId);
          setUserCollections(collections.slice(0, 3));
        }

        // Get liked artworks from localStorage
        const likes = getLikedArtworks();
        setLikedArtworks(likes.slice(0, 6));

      } catch (error) {
        console.error('Error loading home page data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to ArtHound
          </h1>
          <p className="text-xl text-green-100 mb-8 max-w-2xl">
            Discover, share, and connect with art exhibitions from around the world. 
            Join a community of art enthusiasts and critics.
          </p>
          {!currentUser && (
            <div className="flex gap-4">
              <Link 
                href="/login"
                className="px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                Get Started
              </Link>
              <Link 
                href="/search"
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-400 transition-colors"
              >
                Explore Art
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Logged In User Section */}
        {currentUser && (
          <div className="mb-12">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome back, {currentUser.username}!
                  </h2>
                  <p className="text-gray-600 mt-1">Your recent activity</p>
                </div>
                <Link 
                  href="/profile"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  View Profile →
                </Link>
              </div>

              {/* User's Collections */}
              {userCollections.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Your Collections</h3>
                  <div className="space-y-3">
                    {userCollections.map((collection) => (
                      <div 
                        key={collection._id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {collection.name}
                            </h4>
                            {collection.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {collection.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              {collection.artworks?.length || 0} artworks · Created {new Date(collection.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User's Liked Artworks Preview */}
              {likedArtworks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Your Liked Artworks</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {likedArtworks.slice(0, 3).map((artwork) => (
                      <Link
                        key={artwork.id}
                        href={`/details/${artwork.id}?type=${artwork.type}`}
                        className="relative h-32 bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        {artwork.imageUrl ? (
                          <Image
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-sm text-gray-500">{artwork.title}</span>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {userCollections.length === 0 && likedArtworks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't created any collections or liked any artworks yet.</p>
                  <Link 
                    href="/search"
                    className="text-green-600 hover:text-green-700 font-medium mt-2 inline-block"
                  >
                    Start exploring →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Liked Artworks - For Everyone */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {currentUser ? 'Discover More Art' : 'Popular Artworks'}
              </h2>
              <p className="text-gray-600 mt-1">Explore exhibitions and artworks</p>
            </div>
            <Link 
              href="/search"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Browse All →
            </Link>
          </div>

          {likedArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedArtworks.slice(0, 6).map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/details/${artwork.id}?type=${artwork.type}`}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {artwork.imageUrl ? (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                      {artwork.title}
                    </h3>
                    {artwork.artist && (
                      <p className="text-sm text-gray-500 mt-1">{artwork.artist}</p>
                    )}
                    {artwork.dated && (
                      <p className="text-sm text-gray-400 mt-1">{artwork.dated}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500 mb-4">No artworks to show yet</p>
              <Link 
                href="/search"
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Exploring
              </Link>
            </div>
          )}
        </div>

        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            How ArtHound Works
          </h2>
          <p className="text-lg text-gray-600">
            Simply search for artwork and see what other users have said about it.
          </p>
          <p className="text-lg text-gray-600">
            Alternatively, sign in to create and curate collections and write comments yourself!
          </p>
        </div>

        {!currentUser && (
          <div className="bg-green-600 rounded-lg p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to start?
            </h2>
            <Link 
              href="/login"
              className="inline-block px-8 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              Sign Up Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}