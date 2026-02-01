import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-white/90">Get the latest updates on new products and upcoming sales</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-gray-900 border-0 rounded-full px-6 py-6 w-full md:w-80"
              />
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-full font-semibold whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="text-3xl font-bold mb-4">
              <span className="text-white">FASHION</span>
              <span className="text-[#FF6B6B]">HUB</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your destination for premium fashion. Discover the latest trends and timeless classics.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-[#FF6B6B] p-3 rounded-full transition-colors duration-300"
              >
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-[#FF6B6B] p-3 rounded-full transition-colors duration-300"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-[#FF6B6B] p-3 rounded-full transition-colors duration-300"
              >
                <Twitter className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-[#FF6B6B] transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#FF6B6B] transition-colors duration-200">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#FF6B6B] transition-colors duration-200">
                  Sale
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#FF6B6B] transition-colors duration-200">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#FF6B6B] transition-colors duration-200">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-[#FF6B6B] transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF6B6B] transition-colors duration-200">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF6B6B] transition-colors duration-200">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF6B6B] transition-colors duration-200">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF6B6B] transition-colors duration-200">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#FF6B6B] mt-1 flex-shrink-0" />
                <span>123 Fashion Street, Style City, FC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#FF6B6B] flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-[#FF6B6B] transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#FF6B6B] flex-shrink-0" />
                <a href="mailto:info@fashionhub.com" className="hover:text-[#FF6B6B] transition-colors">
                  info@fashionhub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-400">© 2026 FashionHub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-[#FF6B6B] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FF6B6B] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FF6B6B] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}