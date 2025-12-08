'use client';

import { useEffect, useState } from 'react';
import { getLikedArtworks, type LikedArtwork } from '@/lib/likes';
import { getMyCollections, createCollection, deleteCollection } from '@/lib/backend';
import Image from 'next/image';
import Link from 'next/link';

interface Collection {
  _id: string;
  name: string;
  artworks: string[];
  exhibitions: string[];
  ownerId: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [likedArtworks, setLikedArtworks] = useState<LikedArtwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : 'Guest';
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : 'Art Enthusiast';

  useEffect(() => {
    async function loadData() { 
      const likes = getLikedArtworks(); //grabs liked artwork 
      setLikedArtworks(likes);
      if (userId) {
        try {
          const data = await getMyCollections(userId);
          setCollections(data);
        } catch (error) {
          console.error('Error fetching collections:', error);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [userId]);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim() || !userId) return;

    try {
      const newCollection = await createCollection(userId, newCollectionName, [], []);
      setCollections([newCollection, ...collections]);
      setNewCollectionName('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      await deleteCollection(collectionId);
      setCollections(collections.filter(c => c._id !== collectionId));
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to view your profile</p>
        <Link 
          href="/login"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">{username}</h1>
            <p className="text-gray-600">{role}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span>{likedArtworks.length} Liked</span>
              <span>{collections.length} Collections</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Collections</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + New Collection
          </button>
        </div>

        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <div
                key={collection._id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{collection.name}</h3>
                  <button
                    onClick={() => handleDeleteCollection(collection._id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {collection.artworks.length + collection.exhibitions.length} items
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Created {new Date(collection.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">No collections yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Create your first collection
            </button>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Liked Artworks ({likedArtworks.length})</h2>

        {likedArtworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {likedArtworks.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/details/${artwork.id}?type=${artwork.type}`}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all"
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
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
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
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-500 mb-4">No liked artworks yet</p>
            <Link 
              href="/search"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Explore Art
            </Link>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Create New Collection</h3>
            <form onSubmit={handleCreateCollection}>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewCollectionName('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}