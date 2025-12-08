'use client';

import { getMyCollections, updateCollection } from '@/lib/backend';
import { useEffect, useState } from 'react';
import { getExhibitionById, getArtworkById } from '@/lib/harvardApi';
import { getNotes, createNote, deleteNote } from '@/lib/backend';
import Image from 'next/image';
import Link from 'next/link';
import LikeButton from '@/components/LikeButton';

interface Note {
  _id: string;
  text: string;
  authorId: string;
  targetType: string;
  targetId: string;
  createdAt: string;
}

export default function DetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: 'exhibitions' | 'artworks' }>;
}) {
  const [id, setId] = useState('');
  const [type, setType] = useState<'exhibitions' | 'artworks'>('artworks');
  const [artwork, setArtwork] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [userCollections, setUserCollections] = useState<any[]>([]);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    async function loadParams() {
      const p = await params;
      const sp = await searchParams;
      setId(p.id);
      setType(sp.type || 'artworks');
    }
    loadParams();
  }, [params, searchParams]);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        let artworkData;
        if (type === 'exhibitions') {
          artworkData = await getExhibitionById(id);
        } else {
          artworkData = await getArtworkById(id);
        }
        setArtwork(artworkData);
        
        const notesData = await getNotes(type, id);
        setNotes(notesData);
      } catch (error) {
        console.error('Error loading details:', error);
        setArtwork({ title: 'Error loading artwork', error: true });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, type]);

  useEffect(() => {
    if (!userId) return;
    
    async function loadCollections() {
      try {
        const collections = await getMyCollections(userId);
        setUserCollections(collections);
      } catch (error) {
        console.error('Error loading collections:', error);
      }
    }
    
    loadCollections();
  }, [userId]);

  const handleAddToCollection = async (collectionId: string) => {
    if (!userId) return;
    
    try {
      const collection = userCollections.find(c => c._id === collectionId);
      if (!collection) return;
      
      const updatedArtworks = type === 'artworks' 
        ? [...(collection.artworks || []), id]
        : collection.artworks || [];
      
      const updatedExhibitions = type === 'exhibitions'
        ? [...(collection.exhibitions || []), id]
        : collection.exhibitions || [];
      
      await updateCollection(collectionId, {
        name: collection.name,
        artworks: updatedArtworks,
        exhibitions: updatedExhibitions
      });
      
      setUserCollections(userCollections.map(c => 
        c._id === collectionId 
          ? { ...c, artworks: updatedArtworks, exhibitions: updatedExhibitions }
          : c
      ));
      
      setShowCollectionModal(false);
      alert('Added to collection!');
    } catch (error) {
      console.error('Error adding to collection:', error);
      alert('Failed to add to collection');
    }
  };

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !userId) return;

    setSubmitting(true);
    try {
      const note = await createNote(userId, newNote, type, id);
      setNotes([note, ...notes]);
      setNewNote('');
    } catch (error) {
      console.error('Error posting note:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!userId) return;

    try {
      await deleteNote(noteId, userId);
      setNotes(notes.filter(n => n._id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/search" className="text-green-600 hover:text-green-700 mb-6 inline-block">
          ← Back to Search
        </Link>
        <p className="text-red-600">
          {artwork?.error ? 'Failed to load artwork. Please check your Harvard API key in .env.local' : 'Failed to load artwork details'}
        </p>
      </div>
    );
  }

  const artworkData = {
    id: id,
    title: artwork.title,
    artist: artwork.people?.[0]?.name,
    imageUrl: artwork.primaryimageurl,
    dated: artwork.dated || (artwork.begindate ? `${artwork.begindate}–${artwork.enddate}` : ''),
    type: type === 'exhibitions' ? 'exhibition' as const : 'artwork' as const
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link href="/search" className="text-green-600 hover:text-green-700 mb-6 inline-block">
        ← Back to Search
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Image */}
          <div className="relative">
            {artwork.primaryimageurl ? (
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={artwork.primaryimageurl}
                  alt={artwork.title}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            <div className="absolute top-4 right-4 flex gap-2">
              <LikeButton artwork={artworkData} />
              
              {userId && (
                <button
                  onClick={() => setShowCollectionModal(true)}
                  className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md"
                  title="Add to Collection"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{artwork.title}</h1>

            {artwork.people && artwork.people.length > 0 && (
              <p className="text-xl text-gray-700 mb-2">
                {artwork.people[0].name}
              </p>
            )}

            {artwork.dated && (
              <p className="text-gray-600 mb-2">Date: {artwork.dated}</p>
            )}

            {artwork.begindate && (
              <p className="text-gray-600 mb-2">
                {artwork.begindate} - {artwork.enddate}
              </p>
            )}

            {artwork.medium && (
              <p className="text-gray-600 mb-2">Medium: {artwork.medium}</p>
            )}

            {artwork.culture && (
              <p className="text-gray-600 mb-2">Culture: {artwork.culture}</p>
            )}

            {artwork.venues && artwork.venues.length > 0 && (
              <p className="text-gray-600 mb-2">
                Venue: {artwork.venues.map((v: any) => v.name).join(', ')}
              </p>
            )}

            {artwork.description && (
              <div className="mt-6">
                <h2 className="font-semibold text-lg mb-2">Description</h2>
                <p className="text-gray-700">{artwork.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-6">Community Notes</h2>

        {userId ? (
          <form onSubmit={handleSubmitNote} className="mb-8">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Share your thoughts about this artwork..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-32"
            />
            <button
              type="submit"
              disabled={submitting || !newNote.trim()}
              className="mt-3 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {submitting ? 'Posting...' : 'Post Note'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
              {' '}to leave a note
            </p>
          </div>
        )}

        {notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div key={note._id || `note-${index}`} className="border-b border-gray-200 pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      U
                    </div>
                    <span className="font-medium text-gray-900">User</span>
                  </div>
                  {userId === note.authorId && (
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-gray-700 ml-10">{note.text}</p>
                {note.createdAt && (
                  <p className="text-xs text-gray-400 ml-10 mt-2">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No notes yet. Be the first to share your thoughts!
          </p>
        )}
      </div>

      {/* Add to Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add to Collection</h3>
            
            {userCollections.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {userCollections.map((collection) => {
                  const isInCollection = type === 'artworks'
                    ? collection.artworks?.includes(id)
                    : collection.exhibitions?.includes(id);
                    
                  return (
                    <button
                      key={collection._id}
                      onClick={() => handleAddToCollection(collection._id)}
                      disabled={isInCollection}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isInCollection 
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                          : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                      }`}
                    >
                      <div className="font-medium">{collection.name}</div>
                      <div className="text-sm text-gray-500">
                        {(collection.artworks?.length || 0) + (collection.exhibitions?.length || 0)} items
                        {isInCollection && <span className="ml-2 text-green-600">✓ Added</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any collections yet</p>
                <Link 
                  href="/profile"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Create a collection
                </Link>
              </div>
            )}
            
            <button
              onClick={() => setShowCollectionModal(false)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}