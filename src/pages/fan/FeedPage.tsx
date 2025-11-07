/**
 * Feed Page
 * Main content feed showing posts from followed creators
 */

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/store/authStore';
import { mockPostApi, mockUserApi } from '../../lib/mock/api';
import { toast } from '../../components/shared/Toast';
import { SkeletonPost } from '../../components/shared/LoadingSkeleton';
import { Button } from '../../../components/ui/Button';
import type { Post } from '../../types';

export const FeedPage: React.FC = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, [user]);

  const loadFeed = async () => {
    if (!user) return;

    setIsLoading(true);
    const response = await mockPostApi.getFeed(user.id);

    if (response.success && response.data) {
      setPosts(response.data.data);
    } else {
      toast.error('Failed to load feed');
    }
    setIsLoading(false);
  };

  const handleLike = async (postId: string) => {
    const response = await mockPostApi.toggleLike(postId);
    if (response.success && response.data) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? response.data! : p)));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonPost />
        <SkeletonPost />
        <SkeletonPost />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Feed</h1>
        <p className="text-gray-400">Latest posts from creators you follow</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
          <p className="text-gray-400 mb-4">No posts yet. Follow some creators to see content!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center gap-3">
                <img
                  src={post.creator.avatar}
                  alt={post.creator.displayName}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{post.creator.displayName}</h3>
                    {post.creator.isVerified && <span className="text-[var(--brand-gold)]">✓</span>}
                  </div>
                  <p className="text-sm text-gray-400">@{post.creator.username}</p>
                </div>

                {/* Visibility Badge */}
                {post.visibility !== 'public' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-[var(--brand-gold)]/20 text-[var(--brand-gold)]">
                    {post.visibility === 'icon-only' ? '👑 Icon Only' : '🔒 Subscribers'}
                  </span>
                )}
              </div>

              {/* Post Content */}
              <div className="px-4 pb-4">
                <p className="text-gray-100 whitespace-pre-wrap mb-4">{post.content}</p>

                {/* Media */}
                {post.media.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {post.media.slice(0, 4).map((media) => (
                      <div
                        key={media.id}
                        className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
                      >
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt="Post media"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl">▶️</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                  <span>{post.likeCount.toLocaleString()} likes</span>
                  <span>{post.commentCount} comments</span>
                  <span className="ml-auto text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    variant={post.isLiked ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleLike(post.id)}
                  >
                    {post.isLiked ? '❤️' : '🤍'} Like
                  </Button>
                  <Button variant="outline" size="sm">
                    💬 Comment
                  </Button>
                  <Button variant="outline" size="sm">
                    💰 Tip
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
