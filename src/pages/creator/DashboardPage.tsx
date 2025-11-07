/**
 * Creator Dashboard
 * Analytics and overview for creators
 */

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/store/authStore';
import { mockAnalyticsApi, mockTransactionApi } from '../../lib/mock/api';
import { toast } from '../../components/shared/Toast';
import { LoadingSpinner } from '../../components/shared/LoadingSkeleton';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import type { CreatorAnalytics, Transaction } from '../../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<CreatorAnalytics | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;

    setIsLoading(true);

    const [analyticsRes, transactionsRes] = await Promise.all([
      mockAnalyticsApi.getAnalytics(user.id),
      mockTransactionApi.getTransactions(user.id),
    ]);

    if (analyticsRes.success && analyticsRes.data) {
      setAnalytics(analyticsRes.data);
    }

    if (transactionsRes.success && transactionsRes.data) {
      setTransactions(transactionsRes.data.slice(0, 10));
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" className="text-[var(--brand-gold)]" />
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
        <p className="text-gray-400">Track your performance and earnings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--brand-gold)]">
              ${analytics.totalRevenue.toLocaleString()}
            </div>
            <div
              className={`text-sm mt-2 ${
                analytics.revenueChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {analytics.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(analytics.revenueChange)}% this
              month
            </div>
          </CardContent>
        </Card>

        {/* Subscribers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalSubscribers.toLocaleString()}</div>
            <div className="text-sm text-gray-400 mt-2">
              +{analytics.newSubscribers} new this month
            </div>
          </CardContent>
        </Card>

        {/* Total Views */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-400 mt-2">
              Engagement: {analytics.engagementRate}%
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalPosts}</div>
            <div className="text-sm text-gray-400 mt-2">
              {analytics.postsThisPeriod} this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Subscriptions</span>
                <span className="text-xl font-bold text-[var(--brand-gold)]">
                  ${analytics.subscriptionRevenue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tips</span>
                <span className="text-xl font-bold text-[var(--brand-gold)]">
                  ${analytics.tipRevenue.toFixed(2)}
                </span>
              </div>

              {/* Visual Bar */}
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                <div
                  className="bg-[var(--brand-gold)]"
                  style={{
                    width: `${(analytics.subscriptionRevenue / analytics.totalRevenue) * 100}%`,
                  }}
                />
                <div
                  className="bg-[var(--brand-red)]"
                  style={{ width: `${(analytics.tipRevenue / analytics.totalRevenue) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Likes</span>
                <span className="font-medium">{analytics.totalLikes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Comments</span>
                <span className="font-medium">{analytics.totalComments.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Engagement Rate</span>
                <span className="font-medium">{analytics.engagementRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        tx.status === 'completed'
                          ? 'bg-green-400'
                          : tx.status === 'pending'
                          ? 'bg-yellow-400'
                          : 'bg-red-400'
                      }`}
                    />
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--brand-gold)]">
                      ${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
