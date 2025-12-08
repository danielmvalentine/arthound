'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ArthoundNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    router.push('/');
    setUsername(null);
  };
  
  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold hover:text-green-100">
            ArtHound
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/"
              className={`hover:text-green-100 transition font-medium ${
                isActive('/') ? 'border-b-2 border-white' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/search"
              className={`hover:text-green-100 transition font-medium ${
                isActive('/search') ? 'border-b-2 border-white' : ''
              }`}
            >
              Search
            </Link>
            
            {username ? (
              <>
                <Link 
                  href="/profile"
                  className={`hover:text-green-100 transition font-medium ${
                    isActive('/profile') ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Profile
                </Link>
                <Link 
                  href="/credits"
                  className={`hover:text-green-100 transition font-medium ${
                    isActive('/credits') ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Credits
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-green-100 text-sm">
                    {username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-white text-green-600 rounded-md hover:bg-green-50 transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/credits"
                  className={`hover:text-green-100 transition font-medium ${
                    isActive('/credits') ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Credits
                </Link>
                <Link 
                  href="/login"
                  className={`px-4 py-2 bg-white text-green-600 rounded-md hover:bg-green-50 transition font-medium ${
                    isActive('/login') ? 'ring-2 ring-white' : ''
                  }`}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}