'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useRouter } from 'next/navigation';

interface Milestone {
  description: string;
  amount: string;
}

export default function CreateRequestPage() {
  const router = useRouter();
  const { isConnected, connectWallet } = useWallet();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'portrait',
    budget: '',
    deadline: '',
  });

  const [milestones, setMilestones] = useState<Milestone[]>([
    { description: 'Initial sketch', amount: '' },
    { description: 'Mid-progress review', amount: '' },
    { description: 'Final delivery', amount: '' },
  ]);

  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addMilestone = () => {
    setMilestones([...milestones, { description: '', amount: '' }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: 'description' | 'amount', value: string) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const calculateTotalAmount = () => {
    return milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      await connectWallet();
      return;
    }

    setSubmitting(true);

    try {
      // TODO: Implement actual submission logic
      // 1. Upload images to IPFS
      // 2. Create metadata JSON
      // 3. Call smart contract createCommission

      console.log('Submitting commission request:', {
        formData,
        milestones,
        images,
        totalAmount: calculateTotalAmount(),
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('Commission request created successfully!');
      router.push('/explore');
    } catch (error) {
      console.error('Failed to create commission:', error);
      alert('Failed to create commission request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Create Art Request</h1>
          <p className="text-xl text-gray-300">
            Describe your vision and talented artists will bid to bring it to life
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
                  placeholder="e.g., Custom Portrait in Watercolor Style"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-gold transition-colors resize-none"
                  placeholder="Describe your vision in detail. What style, mood, or specific elements do you want?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                    <option value="abstract">Abstract</option>
                    <option value="digital">Digital Art</option>
                    <option value="sculpture">Sculpture</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Deadline *</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reference Images */}
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Reference Images</h2>

            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary-gold transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-semibold mb-2">Upload reference images</p>
                <p className="text-sm text-gray-400">PNG, JPG up to 10MB each</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square bg-white/5 rounded-lg overflow-hidden">
                    <img src={URL.createObjectURL(img)} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Milestones */}
          <div className="glass-card p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Milestones & Payment</h2>
                <p className="text-sm text-gray-400 mt-1">Break your project into stages with payments</p>
              </div>
              <button
                type="button"
                onClick={addMilestone}
                className="btn-secondary text-sm"
              >
                + Add Milestone
              </button>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      required
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
                      placeholder={`Milestone ${index + 1} description`}
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={milestone.amount}
                        onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
                        placeholder="Amount in HBAR"
                      />
                      <span className="text-sm text-gray-400">HBAR</span>
                    </div>
                  </div>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-2xl font-bold">
                <span>Total Budget</span>
                <div className="flex items-center space-x-2">
                  <span className="text-primary-gold">{calculateTotalAmount().toFixed(2)}</span>
                  <span className="text-lg text-gray-400">HBAR</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2 text-right">
                + 2.5% platform fee on each payment
              </p>
            </div>
          </div>

          {/* Hedera Security Badge */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold mb-2">Secured by Hedera Smart Contracts</h3>
                <p className="text-sm text-gray-400">
                  Your funds are held in escrow and only released when you approve milestones.
                  All transactions are recorded immutably on Hedera Testnet for full transparency.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary px-8 py-4 text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-gradient px-8 py-4 text-lg flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Request</span>
                  <span className="text-sm">({calculateTotalAmount().toFixed(2)} HBAR)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
