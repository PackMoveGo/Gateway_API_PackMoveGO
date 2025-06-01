import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Supplies from './pages/Supplies';
import Review from './pages/Review';
import Blog from './pages/Blog';
import Refer from './pages/Refer';
import Locations from './pages/Locations';
import Tips from './pages/Tips';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/supplies" element={<Supplies />} />
            <Route path="/review" element={<Review />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/refer" element={<Refer />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 