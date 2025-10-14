'use client';

import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';

export default function Navbar() {
  const { isConnected, accountId, balance, connecting, connectWallet, disconnectWallet } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center font-bold text-white">
              B2L
            </div>
            <span className="text-xl font-bold">Bring2Life</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/explore" className="hover:text-primary-gold transition-colors">
              Explore
            </Link>
            <Link href="/create-request" className="hover:text-primary-gold transition-colors">
              Post Request
            </Link>
            <Link href="/artists" className="hover:text-primary-gold transition-colors">
              Browse Artists
            </Link>
            <Link href="/how-it-works" className="hover:text-primary-gold transition-colors">
              How It Works
            </Link>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {/* Hedera Badge */}
            <div className="hidden md:flex items-center space-x-2 glass-card px-4 py-2 rounded-full border border-primary-gold/30">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-navy">H</span>
              </div>
              <span className="text-xs font-semibold text-primary-gold">POWERED BY HEDERA</span>
            </div>

            {/* Connect Wallet Button */}
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="btn-gradient flex items-center space-x-2"
              >
                {connecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="glass-card px-4 py-2 rounded-lg flex items-center space-x-3 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">{balance.toFixed(2)} HBAR</span>
                    <span className="text-xs text-gray-400">{truncateAddress(accountId!)}</span>
                  </div>
                  <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center font-bold text-white">
                    {accountId?.slice(4, 5)}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 glass-card rounded-lg overflow-hidden">
                    <Link
                      href="/profile"
                      className="block px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Profile</span>
                      </div>
                    </Link>
                    <Link
                      href="/my-commissions"
                      className="block px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>My Commissions</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-white/10 transition-colors text-red-400"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Disconnect</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
