'use client';

import Link from 'next/link';
import { Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#05055f] text-white px-4 pt-8 pb-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About */}
        <section aria-labelledby="footer-about">
          <h2 id="footer-about" className="text-lg font-bold mb-3">Sarkari Result</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            Latest updates on Sarkari Jobs, Admit Cards, Results, and Notifications. Trusted source for job seekers across India.
          </p>
        </section>

        {/* Quick Links */}
        <nav aria-labelledby="footer-links">
          <h3 id="footer-links" className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-gray-300 hover:text-white hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="text-gray-300 hover:text-white hover:underline">Contact</Link></li>
            <li><Link href="/privacy-policy" className="text-gray-300 hover:text-white hover:underline">Privacy Policy</Link></li>
            <li><Link href="/disclaimer" className="text-gray-300 hover:text-white hover:underline">Disclaimer</Link></li>
          </ul>
        </nav>

        {/* Categories */}
        <nav aria-labelledby="footer-categories">
          <h3 id="footer-categories" className="text-lg font-bold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/latest-jobs" className="text-gray-300 hover:text-white hover:underline">Latest Jobs</Link></li>
            <li><Link href="/admit-card" className="text-gray-300 hover:text-white hover:underline">Admit Card</Link></li>
            <li><Link href="/result" className="text-gray-300 hover:text-white hover:underline">Results</Link></li>
            <li><Link href="/syllabus" className="text-gray-300 hover:text-white hover:underline">Syllabus</Link></li>
          </ul>
        </nav>

        {/* Contact */}
        <section aria-labelledby="footer-contact">
          <h3 id="footer-contact" className="text-lg font-bold mb-3">Contact Info</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start">
              <Mail className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
              <a href="mailto:sarkariresult.ash@gmail.com" className="hover:text-white hover:underline break-all">
                sarkariresult.ash@gmail.com
              </a>
            </li>
            <li className="flex items-start">
              <ShieldCheck className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
              <span>Independent platform not affiliated with any government body.</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Bottom */}
      <div className="text-center text-sm text-gray-400 mt-8 border-t border-gray-700 pt-6">
        &copy; {new Date().getFullYear()} <Link href="/" className="hover:text-white hover:underline">NewSarkariResult.co.in</Link>. All rights reserved.
      </div>
    </footer>
  );
}
