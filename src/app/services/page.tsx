import Link from 'next/link'

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Comprehensive moving solutions tailored to your needs. From packing to storage, 
              we handle every aspect of your move.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Packing Services */}
            <div className="card">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Packing Services</h3>
              <p className="text-gray-600 mb-4">
                Professional packing services to ensure your belongings are safely packed and protected during transit.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Professional packing materials</li>
                <li>• Fragile item protection</li>
                <li>• Room-by-room organization</li>
                <li>• Labeling and inventory</li>
              </ul>
              <Link href="/booking" className="btn-primary">
                Get Quote
              </Link>
            </div>

            {/* Moving Services */}
            <div className="card">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Moving Services</h3>
              <p className="text-gray-600 mb-4">
                Reliable moving services with experienced professionals and proper equipment for safe transportation.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Residential moves</li>
                <li>• Commercial relocations</li>
                <li>• Long-distance moves</li>
                <li>• Furniture protection</li>
              </ul>
              <Link href="/booking" className="btn-primary">
                Get Quote
              </Link>
            </div>

            {/* Storage Solutions */}
            <div className="card">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Storage Solutions</h3>
              <p className="text-gray-600 mb-4">
                Secure storage facilities for your belongings during transitions or when you need extra space.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Climate-controlled units</li>
                <li>• 24/7 security</li>
                <li>• Flexible rental terms</li>
                <li>• Easy access</li>
              </ul>
              <Link href="/booking" className="btn-primary">
                Get Quote
              </Link>
            </div>

            {/* Specialty Services */}
            <div className="card">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Specialty Services</h3>
              <p className="text-gray-600 mb-4">
                Specialized moving services for unique items and situations requiring extra care and attention.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Piano moving</li>
                <li>• Art and antiques</li>
                <li>• Electronics and appliances</li>
                <li>• Office equipment</li>
              </ul>
              <Link href="/booking" className="btn-primary">
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Consultation</h3>
              <p className="text-gray-600">
                We discuss your moving needs and provide a detailed quote.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Planning</h3>
              <p className="text-gray-600">
                We create a customized moving plan tailored to your requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Execution</h3>
              <p className="text-gray-600">
                Our professional team executes the move with care and precision.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Completion</h3>
              <p className="text-gray-600">
                We ensure everything is in place and you're satisfied with the service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white section-padding">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and quote on your moving needs.
          </p>
          <Link href="/booking" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors duration-200">
            Get Free Quote
          </Link>
        </div>
      </section>
    </div>
  )
} 