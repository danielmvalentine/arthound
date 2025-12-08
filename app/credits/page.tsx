import Link from 'next/link';

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg border border-gray-200 p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Credits</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Created By</h2>
            <div className="space-y-2">
              <p className="text-gray-700">Daniel Valentine Sec 01</p>
              <p className="text-gray-700">Eshal Jahan Sec 01</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">GitHub Repositories</h2>
            <div className="space-y-3">
              <a 
                href="https://github.com/danielmvalentine/arthound"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Frontend Repository</div>
                <div className="text-sm text-gray-600 mt-1">github.com/danielmvalentine/arthound</div>
              </a>
              
              <a 
                href="https://github.com/danielmvalentine/arthound-backend"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Backend Repository</div>
                <div className="text-sm text-gray-600 mt-1">github.com/danielmvalentine/arthound-backend</div>
              </a>
            </div>
          </div>

          <div className="pt-4">
            <Link 
              href="/"
              className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}