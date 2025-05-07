import React from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaLinkedin, FaYelp, FaYoutube, FaTwitter, FaInstagram, FaReddit, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">OC Professional Mover's</h3>
            <p className="text-gray-300 mb-4">
              Get access to a team of professional movers & packers specialized in moving services, 
              careful handling of your belongings, and timely transportation to your new destination.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xl font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/booking" className="text-gray-300 hover:text-white">Booking</Link></li>
              <li><Link to="/supplies" className="text-gray-300 hover:text-white">Supplies</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
              <li><Link to="/review" className="text-gray-300 hover:text-white">Review</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
              <li><Link to="/refer" className="text-gray-300 hover:text-white">Refer Friends</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Phone: (949) 648-7057</li>
              <li>Email: Support@OCMovers.com</li>
              <li>1369 Adams Ave, Costa Mesa, CA, 92626</li>
            </ul>
            <div className="mt-4">
              <h4 className="font-bold mb-2">Working Hours</h4>
              <p className="text-gray-300">Mon - Thur: Closed</p>
              <p className="text-gray-300">Fri - Sun: 5am - 12pm</p>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/locations" className="text-gray-300 hover:text-white">Locations</Link></li>
              <li><Link to="/tips" className="text-gray-300 hover:text-white">Tips</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQs</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mt-8 flex justify-center space-x-4">
          <a href="#" className="text-gray-300 hover:text-white"><FaGoogle size={24} /></a>
          <a href="#" className="text-gray-300 hover:text-white"><FaFacebook size={24} /></a>
          <a href="#" className="text-gray-300 hover:text-white"><FaLinkedin size={24} /></a>
          <a href="#" className="text-gray-300 hover:text-white"><FaYelp size={24} /></a>
          <a href="#" className="text-gray-300 hover:text-white"><FaYoutube size={24} /></a>
          <a href="#" className="text-gray-300 hover:text-white"><FaTwitter size={24} /></a>
          <a href="#" className="text-gray-300 hover:text-white"><FaInstagram size={24} /></a>
          <a href="#" className="text-gray-300 hover:text-white"><FaReddit size={24} /></a>
          <a href="#" className="text-gray-300 hover:text-white"><FaPinterest size={24} /></a>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>© OC Pro Mover's since 2025</p>
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="hover:text-white">Terms of Service Conditions</Link>
            <Link to="/privacy" className="hover:text-white">Privacy & Terms of use Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 