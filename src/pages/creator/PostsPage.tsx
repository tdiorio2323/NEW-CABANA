/**
 * Creator Posts Page
 * Manage and create posts
 */

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/store/authStore';
import { mockPostApi } from '../../lib/mock/api';
import { Button } from '../../../components/ui/Button';
import { toast } from '../../components/shared/Toast';
import type { Post } from '../../types';

export const PostsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [user]);

  const loadPosts = async () => {
    if (!user) return;
    setIsLoading(true);
    const response = await mockPostApi.getPostsByCreator(user.id);
    if (response.success && response.data) {
      setPosts(response.data);
    }
    setIsLoading(false);
  };

  const handleDelete = async (postId: string) => {
    if (!user) return;
    const response = await mockPostApi.deletePost(postId, user.id);
    if (response.success) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success('Post deleted');
    } else {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <Button variant="primary">+ Create Post</Button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
          <p className="text-gray-400">No posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <p className="mb-2">{post.content}</p>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>{post.likeCount} likes</span>
                <span>{post.commentCount} comments</span>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => handleDelete(post.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
