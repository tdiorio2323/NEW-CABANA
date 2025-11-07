/**
 * Profile Page
 * User profile view and edit
 */

import React from 'react';
import { useAuthStore } from '../lib/store/authStore';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <img src={user.avatar} alt={user.displayName} className="w-24 h-24 rounded-full border-4 border-[var(--brand-gold)]" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{user.displayName}</h2>
                {user.isVerified && <span className="text-[var(--brand-gold)] text-xl">✓</span>}
              </div>
              <p className="text-gray-400 mb-4">@{user.username}</p>
              <p className="text-gray-300 mb-4">{user.bio || 'No bio yet'}</p>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {user.role === 'creator' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{user.subscriberCount?.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[var(--brand-gold)]">${user.totalEarnings?.toLocaleString()}</p>
              </CardContent>
            </Card>
          </>
        )}
        {user.role === 'fan' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Following</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{user.followingCount}</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold capitalize">{user.subscriptionTier}</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Role</span>
            <span className="capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Member Since</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
