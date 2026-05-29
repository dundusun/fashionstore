import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
          <h3 className="text-3xl font-black tracking-widest mb-6">DUNDUSUN</h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            Redefining premium sustainable fashion for the modern aesthetic. Dress to stand out, sustainably.
          </p>
          <div className="flex gap-4">
            <span className="cursor-pointer bg-white/10 p-3 rounded-full hover:bg-white hover:text-black transition-colors">📸</span>
            <span className="cursor-pointer bg-white/10 p-3 rounded-full hover:bg-white hover:text-black transition-colors">🐦</span>
            <span className="cursor-pointer bg-white/10 p-3 rounded-full hover:bg-white hover:text-black transition-colors">📘</span>
          </div>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-widest mb-6 text-sm text-gray-300">Shop</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Link to="/women" className="hover:text-white transition-colors">Women's Fashion</Link></li>
            <li><Link to="/men" className="hover:text-white transition-colors">Men's Collection</Link></li>
            <li><Link to="/kids" className="hover:text-white transition-colors">Kids & Baby</Link></li>
            <li><Link to="/sale" className="hover:text-white transition-colors">Clearance Sale</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-widest mb-6 text-sm text-gray-300">Support</h4>
          <ul className="space-y-4 text-gray-400">
            <li><span className="cursor-pointer hover:text-white transition-colors">FAQ</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">Shipping & Returns</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">Size Guide</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">Contact Us</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-widest mb-6 text-sm text-gray-300">Legal</h4>
          <ul className="space-y-4 text-gray-400">
            <li><span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">Cookie Policy</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
        <p>© 2026 Dundusun Fashion. All rights reserved.</p>
        <div className="flex gap-4">
          <span>Visa</span>
          <span>MasterCard</span>
          <span>PayPal</span>
          <span>Apple Pay</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
