export interface LikedArtwork {
    id: string;
    title: string;
    artist?: string;
    imageUrl?: string;
    dated?: string;
    type: 'exhibition' | 'artwork';
  }
  
  export function getLikedArtworks(): LikedArtwork[] {
    if (typeof window === 'undefined') return [];
    const likes = localStorage.getItem('likedArtworks');
    return likes ? JSON.parse(likes) : [];
  }
  
  export function isArtworkLiked(id: string): boolean {
    const likes = getLikedArtworks();
    return likes.some(item => item.id === id);
  }
  
  export function toggleLike(artwork: LikedArtwork): boolean {
    const likes = getLikedArtworks();
    const index = likes.findIndex(item => item.id === artwork.id);
    
    if (index > -1) {
      likes.splice(index, 1);
      localStorage.setItem('likedArtworks', JSON.stringify(likes));
      return false;
    } else {
      likes.push(artwork);
      localStorage.setItem('likedArtworks', JSON.stringify(likes));
      return true;
    }
  }