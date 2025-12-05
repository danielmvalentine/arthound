const API_KEY = process.env.HARVARD_API_KEY;
const BASE_URL = 'https://api.harvardartmuseums.org';

export interface Exhibition {
  id: number;
  title: string;
  description?: string;
  begindate: string;
  enddate: string;
  venues?: { name: string }[];
  primaryimageurl?: string;
  images?: { baseimageurl: string }[];
  url?: string;
}

export interface Artwork {
  id: number;
  title: string;
  people?: { name: string; role: string }[];
  dated?: string;
  medium?: string;
  culture?: string;
  primaryimageurl?: string;
  description?: string;
}

export interface SearchResponse<T> {
  records: T[];
  info: {
    totalrecords: number;
    pages: number;
    page: number;
  };
}

// Search exhibitions
export async function searchExhibitions(
  query: string,
  page: number = 1,
  size: number = 20
): Promise<SearchResponse<Exhibition>> {
  const params = new URLSearchParams({
    apikey: API_KEY!,
    q: query,
    page: page.toString(),
    size: size.toString(),
    sort: 'random',
  });

  const response = await fetch(`${BASE_URL}/exhibition?${params}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error('Failed to fetch exhibitions');
  }

  return response.json();
}

// Get single exhibition by ID
export async function getExhibitionById(id: string): Promise<Exhibition> {
  const params = new URLSearchParams({
    apikey: API_KEY!,
  });

  const response = await fetch(`${BASE_URL}/exhibition/${id}?${params}`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch exhibition');
  }

  return response.json();
}

// Search artworks (alternative to exhibitions)
export async function searchArtworks(
  query: string,
  page: number = 1,
  size: number = 20
): Promise<SearchResponse<Artwork>> {
  const params = new URLSearchParams({
    apikey: API_KEY!,
    q: query,
    page: page.toString(),
    size: size.toString(),
    hasimage: '1', // Only get artworks with images
  });

  const response = await fetch(`${BASE_URL}/object?${params}`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch artworks');
  }

  return response.json();
}

// Get single artwork by ID
export async function getArtworkById(id: string): Promise<Artwork> {
  const params = new URLSearchParams({
    apikey: API_KEY!,
  });

  const response = await fetch(`${BASE_URL}/object/${id}?${params}`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch artwork');
  }

  return response.json();
}

// Get recent exhibitions
export async function getRecentExhibitions(size: number = 10): Promise<SearchResponse<Exhibition>> {
  const params = new URLSearchParams({
    apikey: API_KEY!,
    size: size.toString(),
    sort: 'enddate',
    sortorder: 'desc',
  });

  const response = await fetch(`${BASE_URL}/exhibition?${params}`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recent exhibitions');
  }

  return response.json();
}