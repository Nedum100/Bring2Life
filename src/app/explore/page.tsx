'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Commission {
  id: number;
  title: string;
  category: string;
  budget: number;
  deadline: string;
  client: {
    name: string;
    avatar: string;
  };
  bids: number;
  status: 'open' | 'in_progress' | 'completed';
  featured: boolean;
}

// Mock data
const mockCommissions: Commission[] = [
  {
    id: 1,
    title: 'Custom Portrait in Watercolor Style',
    category: 'portrait',
    budget: 150,
    deadline: '2025-11-15',
    client: { name: 'Sarah M.', avatar: '' },
    bids: 12,
    status: 'open',
    featured: true,
  },
  {
    id: 2,
    title: 'Abstract Digital Art for Album Cover',
    category: 'digital',
    budget: 300,
    deadline: '2025-11-20',
    client: { name: 'Mike R.', avatar: '' },
    bids: 8,
    status: 'open',
    featured: true,
  },
  {
    id: 3,
    title: 'Landscape Oil Painting of Mountain View',
    category: 'landscape',
    budget: 500,
    deadline: '2025-12-01',
    client: { name: 'Emily K.', avatar: '' },
    bids: 15,
    status: 'open',
    featured: false,
  },
  {
    id: 4,
    title: 'Modern Sculpture for Office Space',
    category: 'sculpture',
    budget: 2000,
    deadline: '2026-01-15',
    client: { name: 'Tech Corp', avatar: '' },
    bids: 5,
    status: 'open',
    featured: true,
  },
  {
    id: 5,
    title: 'Pet Portrait in Charcoal',
    category: 'portrait',
    budget: 100,
    deadline: '2025-11-10',
    client: { name: 'James L.', avatar: '' },
    bids: 20,
    status: 'open',
    featured: false,
  },
  {
    id: 6,
    title: 'Fantasy Character Design',
    category: 'digital',
    budget: 250,
    deadline: '2025-11-25',
    client: { name: 'GameDev Studio', avatar: '' },
    bids: 18,
    status: 'open',
    featured: false,
  },
];

export default function ExplorePage() {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  const filteredCommissions = mockCommissions.filter((c) =>
    filter === 'all' ? true : c.category === filter
  );

  const categoryIcons: Record<string, string> = {
    portrait: '👤',
    landscape: '🏔️',
    abstract: '🎨',
    digital: '💻',
    sculpture: '🗿',
    other: '✨',
  };

  const getCategoryBadgeColor = (category: string): string => {
    const colors: Record<string, string> = {
      portrait: 'bg-blue-500/20 text-blue-300',
      landscape: 'bg-green-500/20 text-green-300',
      abstract: 'bg-purple-500/20 text-purple-300',
      digital: 'bg-cyan-500/20 text-cyan-300',
      sculpture: 'bg-orange-500/20 text-orange-300',
      other: 'bg-gray-500/20 text-gray-300',
    };
    return colors[category] || colors.other;
  };

  const daysUntilDeadline = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Explore Commissions</h1>
          <p className="text-xl text-gray-300">
            Browse open art requests and submit your bid
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-gradient-accent text-white'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                All
              </button>
              {Object.keys(categoryIcons).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                    filter === cat
                      ? 'bg-gradient-accent text-white'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span>{categoryIcons[cat]}</span>
                  <span className="capitalize">{cat}</span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
              >
                <option value="recent">Most Recent</option>
                <option value="budget">Highest Budget</option>
                <option value="deadline">Deadline</option>
                <option value="bids">Most Bids</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredCommissions.length}</span> open requests
          </p>
        </div>

        {/* Commissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommissions.map((commission) => (
            <Link
              href={`/commission/${commission.id}`}
              key={commission.id}
              className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            >
              {/* Featured Badge */}
              {commission.featured && (
                <div className="bg-gradient-accent px-4 py-2 text-center text-sm font-bold">
                  ⭐ Featured
                </div>
              )}

              {/* Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary-gold/20 to-primary-orange/20 flex items-center justify-center text-6xl">
                {categoryIcons[commission.category]}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(
                      commission.category
                    )}`}
                  >
                    {commission.category.charAt(0).toUpperCase() + commission.category.slice(1)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-3 line-clamp-2">{commission.title}</h3>

                {/* Budget */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Budget</p>
                    <p className="text-2xl font-bold text-primary-gold">{commission.budget} HBAR</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Bids</p>
                    <p className="text-lg font-semibold">{commission.bids}</p>
                  </div>
                </div>

                {/* Client */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center font-bold text-sm">
                    {commission.client.name.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-300">{commission.client.name}</span>
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{daysUntilDeadline(commission.deadline)} days left</span>
                  </div>
                  <button className="text-primary-gold font-semibold hover:underline">
                    View Details →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCommissions.length === 0 && (
          <div className="glass-card p-16 rounded-2xl text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No commissions found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or check back later for new requests
            </p>
            <Link href="/create-request" className="btn-gradient inline-block">
              Create Your Own Request
            </Link>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 glass-card p-12 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Have a vision? Post your art request and connect with talented artists
          </p>
          <Link href="/create-request" className="btn-gradient text-lg px-8 py-4 inline-block">
            Create Art Request
          </Link>
        </div>
      </div>
    </div>
  );
}
