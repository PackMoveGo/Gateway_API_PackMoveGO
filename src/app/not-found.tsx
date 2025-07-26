import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-x-4">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>

        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-4">Popular Pages</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services" className="text-blue-600 hover:text-blue-800">
              Services
            </Link>
            <Link href="/about" className="text-blue-600 hover:text-blue-800">
              About Us
            </Link>
            <Link href="/booking" className="text-blue-600 hover:text-blue-800">
              Book Now
            </Link>
            <Link href="/supplies" className="text-blue-600 hover:text-blue-800">
              Supplies
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 