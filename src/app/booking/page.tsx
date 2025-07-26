import Link from 'next/link'

export default function BookingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Book Your Move</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get your free quote and book your professional moving service today. 
              Our team is ready to make your move stress-free.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Get Your Free Quote</h2>
              <form className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Move Details */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Move Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="moveDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Move Date *
                      </label>
                      <input
                        type="date"
                        id="moveDate"
                        name="moveDate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="moveType" className="block text-sm font-medium text-gray-700 mb-1">
                        Type of Move *
                      </label>
                      <select
                        id="moveType"
                        name="moveType"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select move type</option>
                        <option value="residential">Residential Move</option>
                        <option value="commercial">Commercial Move</option>
                        <option value="long-distance">Long Distance Move</option>
                        <option value="local">Local Move</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Addresses</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address *</label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="pickupStreet"
                          placeholder="Street Address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <input
                          type="text"
                          name="pickupCity"
                          placeholder="City"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mt-2">
                        <input
                          type="text"
                          name="pickupState"
                          placeholder="State"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <input
                          type="text"
                          name="pickupZip"
                          placeholder="ZIP Code"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="deliveryStreet"
                          placeholder="Street Address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <input
                          type="text"
                          name="deliveryCity"
                          placeholder="City"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mt-2">
                        <input
                          type="text"
                          name="deliveryState"
                          placeholder="State"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <input
                          type="text"
                          name="deliveryZip"
                          placeholder="ZIP Code"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Services Needed</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input type="checkbox" name="packing" className="mr-2" />
                      <span>Packing Services</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="moving" className="mr-2" />
                      <span>Moving Services</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="storage" className="mr-2" />
                      <span>Storage Solutions</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="supplies" className="mr-2" />
                      <span>Moving Supplies</span>
                    </label>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="homeSize" className="block text-sm font-medium text-gray-700 mb-1">
                        Home Size
                      </label>
                      <select
                        id="homeSize"
                        name="homeSize"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select home size</option>
                        <option value="studio">Studio (0-1 bedroom)</option>
                        <option value="1br">1 Bedroom</option>
                        <option value="2br">2 Bedroom</option>
                        <option value="3br">3 Bedroom</option>
                        <option value="4br">4+ Bedroom</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="specialItems" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Items
                      </label>
                      <select
                        id="specialItems"
                        name="specialItems"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select special items</option>
                        <option value="piano">Piano</option>
                        <option value="art">Art/Antiques</option>
                        <option value="appliances">Large Appliances</option>
                        <option value="electronics">Electronics</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional information about your move..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-3 text-lg"
                >
                  Get Free Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Pack Move Go?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Quotes</h3>
              <p className="text-gray-600">
                Get a detailed, no-obligation quote for your move with transparent pricing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Licensed & Insured</h3>
              <p className="text-gray-600">
                Fully licensed and insured to protect your belongings during the entire move.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">On-Time Service</h3>
              <p className="text-gray-600">
                We understand the importance of timing and always arrive when promised.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 