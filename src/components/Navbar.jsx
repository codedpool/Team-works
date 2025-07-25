'use client'
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // Set to relative for the mobile dropdown positioning
    <nav className="relative w-full z-50 bg-transparent">
      {/* Use a standard max-width container for content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* LEFT SIDE: Logo and Navigation Links */}
          <div className="flex items-center gap-x-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="Team Works Inc"
                className="h-10 w-auto" // Simplified height
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8 text-gray-700 font-medium">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
              <Link href="/services" className="hover:text-blue-600 transition-colors">Services</Link>
              <Link href="/client" className="hover:text-blue-600 transition-colors">Client</Link>
              <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact us</Link>
            </div>
          </div>

          {/* RIGHT SIDE: Action Buttons and Mobile Menu Toggle */}
          <div className="flex items-center">
            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <button className="text-gray-600 hover:text-blue-700 font-medium text-base px-5 py-2 rounded-full border border-gray-300 bg-white">
                Sign In
              </button>
              <button className="text-white font-medium text-base px-5 py-2 rounded-full shadow-md" style={{
                background: 'linear-gradient(135.72deg, #4198C9 5.3%, #036DA9 115.18%)'
              }}>
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden ml-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-lg"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <div className="space-y-1">
              <Link href="/" className="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/about" className="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link href="/services" className="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
              <Link href="/client" className="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Client</Link>
              <Link href="/contact" className="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Contact us</Link>
            </div>
            <div className="pt-4 border-t border-gray-200/50 space-y-3">
              <button className="w-full py-3 px-5 text-gray-700 hover:text-gray-900 font-medium text-base border border-gray-200/50 rounded-lg hover:bg-gray-50/80 backdrop-blur-sm">Sign In</button>
              <button className="w-full py-3 px-5 text-white rounded-lg font-medium text-base" style={{ background: 'linear-gradient(135.72deg, #4198C9 5.3%, #036DA9 115.18%)' }}>Sign Up</button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Divider Line - Removed for seamless blend */}
    </nav>
  );
}
