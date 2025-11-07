/**
 * Loading Skeleton Components
 * Display loading states for various content types
 */

import React from 'react';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-800 rounded ${className}`} />
);

export const SkeletonText: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-800 rounded h-4 ${className}`} />
);

export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  return <div className={`animate-pulse bg-gray-800 rounded-full ${sizes[size]}`} />;
};

export const SkeletonPost: React.FC = () => (
  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      <SkeletonAvatar size="md" />
      <div className="flex-1 space-y-2">
        <SkeletonText className="w-32" />
        <SkeletonText className="w-20" />
      </div>
    </div>

    {/* Content */}
    <div className="space-y-2 mb-4">
      <SkeletonText className="w-full" />
      <SkeletonText className="w-5/6" />
      <SkeletonText className="w-4/6" />
    </div>

    {/* Media */}
    <SkeletonBox className="w-full h-64 mb-4" />

    {/* Actions */}
    <div className="flex gap-4">
      <SkeletonBox className="w-16 h-8" />
      <SkeletonBox className="w-16 h-8" />
      <SkeletonBox className="w-16 h-8" />
    </div>
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
    <SkeletonText className="w-32 mb-4" />
    <SkeletonBox className="w-full h-32 mb-4" />
    <SkeletonText className="w-full mb-2" />
    <SkeletonText className="w-4/5" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
    {/* Header */}
    <div className="flex gap-4 p-4 border-b border-gray-800">
      <SkeletonText className="w-1/4" />
      <SkeletonText className="w-1/4" />
      <SkeletonText className="w-1/4" />
      <SkeletonText className="w-1/4" />
    </div>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border-b border-gray-800 last:border-b-0">
        <SkeletonText className="w-1/4" />
        <SkeletonText className="w-1/4" />
        <SkeletonText className="w-1/4" />
        <SkeletonText className="w-1/4" />
      </div>
    ))}
  </div>
);

export const SkeletonProfile: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center gap-6">
      <SkeletonAvatar size="lg" />
      <div className="flex-1 space-y-3">
        <SkeletonText className="w-48" />
        <SkeletonText className="w-64" />
        <div className="flex gap-4">
          <SkeletonBox className="w-24 h-10" />
          <SkeletonBox className="w-24 h-10" />
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <SkeletonText className="w-16 mb-2" />
          <SkeletonText className="w-24" />
        </div>
      ))}
    </div>

    {/* Content */}
    <SkeletonBox className="w-full h-96" />
  </div>
);

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4 text-[var(--brand-gold)]" />
      <p className="text-gray-400">{message}</p>
    </div>
  </div>
);
