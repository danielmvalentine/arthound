import Link from 'next/link';

export default function ArthoundNavigation() {
return (
    <nav className="bg-green-900 text-white shadow-md">
    <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold hover:text-green-100">
            ArtHound
        </Link>
        
        <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-green-100 font-medium">
            Home
            </Link>
            <Link href="/search" className="hover:text-green-100 font-medium">
            Search
            </Link>
            <Link href="/profile" className="hover:text-green-100 font-medium">
            Profile
            </Link>
            <Link href="https://github.com/danielmvalentine/arthound"
            className="hover:text-green-100 font-medium">
            Front-end
            </Link>
            <Link href="https://github.com/danielmvalentine/arthound-backend"
            className="hover:text-green-100 font-medium">
            Back-end
            </Link>
            <Link 
            href="/login" 
            className="px-4 py-2 bg-white text-green-600 rounded-md hover:bg-green-50 font-medium"
            >
            Login
            </Link>
        </div>
        </div>
    </div>
    </nav>
);
}