/**
 * Messaging Page
 * Conversations and direct messages
 */

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/store/authStore';
import { mockMessagingApi } from '../../lib/mock/api';
import type { Conversation } from '../../types';

export const MessagingPage: React.FC = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    setIsLoading(true);
    const response = await mockMessagingApi.getConversations(user.id);
    if (response.success && response.data) {
      setConversations(response.data);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : conversations.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
          <p className="text-gray-400">No conversations yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <div key={conv.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 hover:border-gray-700 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {conv.participants.map((p) => (
                    <img key={p.id} src={p.avatar} alt={p.displayName} className="w-10 h-10 rounded-full border-2 border-gray-900" />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {conv.participants.filter((p) => p.id !== user?.id).map((p) => p.displayName).join(', ')}
                  </p>
                  <p className="text-sm text-gray-400 truncate">{conv.lastMessage?.content}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-[var(--brand-red)] text-white text-xs px-2 py-1 rounded-full">{conv.unreadCount}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
