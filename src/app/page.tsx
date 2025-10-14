'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Commission Custom Art
              <br />
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                With Blockchain Trust
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with talented artists, secure payments with smart contracts,
              and own authentic NFT certificates. All powered by Hedera.
            </p>

            <div className="flex items-center justify-center space-x-4 mb-12">
              <button className="btn-gradient text-lg px-8 py-4">
                Get Started
              </button>
              <button
                onClick={() => setShowHowItWorks(!showHowItWorks)}
                className="btn-secondary text-lg px-8 py-4"
              >
                Learn More
              </button>
            </div>

            {/* Powered by Hedera Badge */}
            <div className="inline-flex items-center space-x-3 glass-card px-6 py-3 rounded-full">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-navy">H</span>
              </div>
              <span className="text-sm font-semibold">POWERED BY HEDERA</span>
            </div>
          </div>

          {/* How It Works - Collapsible */}
          {showHowItWorks && (
            <div className="mt-16 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3">Post Your Request</h3>
                  <p className="text-gray-300">
                    Upload reference images and describe your vision. Artists will bid on your project.
                  </p>
                </div>

                <div className="glass-card p-8 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3">Choose Your Artist</h3>
                  <p className="text-gray-300">
                    Review portfolios, ratings, and bids. Select the perfect artist for your commission.
                  </p>
                </div>

                <div className="glass-card p-8 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3">Secure Milestone Payments</h3>
                  <p className="text-gray-300">
                    Funds held in escrow. Pay as milestones complete. Receive NFT certificate on completion.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Art Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">Featured Commissions</h2>
            <Link href="/explore" className="text-primary-gold hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-primary-gold/20 to-primary-orange/20 flex items-center justify-center">
                  <span className="text-6xl">🎨</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-accent rounded-full"></div>
                    <span className="font-semibold">Artist Name</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Custom Portrait Commission</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-gold font-bold">100 HBAR</span>
                    <span className="text-sm text-gray-400">3 days ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-card py-12 px-6 mt-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center font-bold text-white">
                  B2L
                </div>
                <span className="text-xl font-bold">Bring2Life</span>
              </div>
              <p className="text-gray-400 text-sm">
                Decentralized art commissions with blockchain trust.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/explore" className="hover:text-white">Explore</Link></li>
                <li><Link href="/create" className="hover:text-white">Post Request</Link></li>
                <li><Link href="/artists" className="hover:text-white">Browse Artists</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Bring2Life. Built on Hedera Testnet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
