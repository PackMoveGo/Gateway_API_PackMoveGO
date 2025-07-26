import Link from 'next/link'

export default function SuppliesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Moving Supplies</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Quality packing materials and moving supplies to ensure your belongings are 
              safely protected during your move.
            </p>
          </div>
        </div>
      </section>

      {/* Supplies Categories */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Supplies</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Boxes */}
            <div className="card">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Moving Boxes</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Small boxes (1.5 cu ft)</li>
                <li>• Medium boxes (3.0 cu ft)</li>
                <li>• Large boxes (4.5 cu ft)</li>
                <li>• Extra large boxes (6.0 cu ft)</li>
                <li>• Wardrobe boxes</li>
                <li>• Dish pack boxes</li>
              </ul>
              <div className="text-center">
                <Link href="/contact" className="btn-primary">
                  Order Boxes
                </Link>
              </div>
            </div>

            {/* Packing Materials */}
            <div className="card">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Packing Materials</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Bubble wrap</li>
                <li>• Packing paper</li>
                <li>• Tissue paper</li>
                <li>• Foam sheets</li>
                <li>• Corner protectors</li>
                <li>• Furniture blankets</li>
              </ul>
              <div className="text-center">
                <Link href="/contact" className="btn-primary">
                  Order Materials
                </Link>
              </div>
            </div>

            {/* Tape & Labels */}
            <div className="card">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Tape & Labels</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Packing tape</li>
                <li>• Masking tape</li>
                <li>• Fragile labels</li>
                <li>• Room labels</li>
                <li>• This way up labels</li>
                <li>• Custom labels</li>
              </ul>
              <div className="text-center">
                <Link href="/contact" className="btn-primary">
                  Order Supplies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Items */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Specialty Items</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Fragile Item Protection</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Glass pack boxes</li>
                <li>• Mirror boxes</li>
                <li>• Picture frame boxes</li>
                <li>• Lamp boxes</li>
                <li>• Electronics boxes</li>
                <li>• Artwork protection</li>
              </ul>
              <Link href="/contact" className="btn-primary">
                Order Protection
              </Link>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Furniture Protection</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Furniture blankets</li>
                <li>• Sofa covers</li>
                <li>• Mattress bags</li>
                <li>• Chair covers</li>
                <li>• Table protectors</li>
                <li>• Corner guards</li>
              </ul>
              <Link href="/contact" className="btn-primary">
                Order Protection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <h3 className="text-xl font-semibold mb-2">Basic Pack</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">$25</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• 10 small boxes</li>
                <li>• 5 medium boxes</li>
                <li>• 2 rolls packing tape</li>
                <li>• 1 roll bubble wrap</li>
                <li>• 50 packing labels</li>
              </ul>
              <Link href="/contact" className="btn-primary">
                Order Basic Pack
              </Link>
            </div>

            <div className="card text-center border-2 border-blue-600">
              <h3 className="text-xl font-semibold mb-2">Standard Pack</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">$50</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• 20 small boxes</li>
                <li>• 10 medium boxes</li>
                <li>• 5 large boxes</li>
                <li>• 3 rolls packing tape</li>
                <li>• 2 rolls bubble wrap</li>
                <li>• 100 packing labels</li>
                <li>• 5 furniture blankets</li>
              </ul>
              <Link href="/contact" className="btn-primary">
                Order Standard Pack
              </Link>
            </div>

            <div className="card text-center">
              <h3 className="text-xl font-semibold mb-2">Premium Pack</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">$100</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• 30 small boxes</li>
                <li>• 15 medium boxes</li>
                <li>• 10 large boxes</li>
                <li>• 5 extra large boxes</li>
                <li>• 5 rolls packing tape</li>
                <li>• 3 rolls bubble wrap</li>
                <li>• 200 packing labels</li>
                <li>• 10 furniture blankets</li>
                <li>• 5 specialty boxes</li>
              </ul>
              <Link href="/contact" className="btn-primary">
                Order Premium Pack
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white section-padding">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Need Supplies?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today to order your moving supplies or get a custom quote for your specific needs.
          </p>
          <div className="space-x-4">
            <Link href="/contact" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors duration-200">
              Order Supplies
            </Link>
            <Link href="/services" className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 