import { searchExhibitions, searchArtworks } from '@/lib/harvardApi';
import Link from 'next/link';
import Image from 'next/image';
import LikeButton from '@/components/LikeButton';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: 'exhibitions' | 'artworks' }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const type = params.type || 'exhibitions';

  let results = null;
  let error = null;

  if (query) {
    try {
      if (type === 'exhibitions') {
        results = await searchExhibitions(query, 1, 100);
      } else {
        results = await searchArtworks(query, 1, 100);
      }
    } catch (e) {
      error = 'Could not load results';
      console.error(e);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Find Art</h1>
        <p className="text-gray-600">Search thousands of exhibitions and artworks</p>
      </div>

      <form method="GET" className="mb-12">
        <div className="flex gap-3">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search..."
            className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            name="type"
            defaultValue={type}
            className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="exhibitions">Exhibitions</option>
            <option value="artworks">Artworks</option>
          </select>
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {results && (
        <div>
          <div className="mb-6 text-gray-700">
            {results.info.totalrecords.toLocaleString()} results found
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.records.map((item) => {
              // Prepare artwork data for liking
              const artworkData = {
                id: item.id.toString(),
                title: item.title,
                artist: 'people' in item && item.people?.[0]?.name,
                imageUrl: item.primaryimageurl,
                dated: 'dated' in item ? item.dated : 
                       'begindate' in item ? `${item.begindate}–${item.enddate}` : undefined,
                type: type
              };

              return (
                <div key={item.id} className="group relative">
                  <Link
                    href={`/details/${item.id}?type=${type}`}
                    className="block"
                  >
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-green-500 transition-all duration-200 hover:shadow-xl">
                      {item.primaryimageurl ? (
                        <div className="relative h-56 bg-gray-100">
                          <Image
                            src={item.primaryimageurl}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
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
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {item.title}
                        </h3>
                        {'begindate' in item && item.begindate && (
                          <p className="text-sm text-gray-500">
                            {item.begindate}–{item.enddate}
                          </p>
                        )}
                        {'dated' in item && item.dated && (
                          <p className="text-sm text-gray-500">{item.dated}</p>
                        )}
                        {'people' in item && item.people && item.people.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            {item.people[0].name}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  {/* Like Button - positioned absolutely */}
                  <div className="absolute top-3 right-3 z-10">
                    <LikeButton artwork={artworkData} />
                  </div>
                </div>
              );
            })}
          </div>

          {results.info.totalrecords > 100 && (
            <div className="mt-12 text-center text-gray-600">
              Showing first 100 results. Try refining your search for more specific results.
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-20">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 text-lg">
            Start by searching for an artist, exhibition, or artwork
          </p>
        </div>
      )}
    </div>
  );
}