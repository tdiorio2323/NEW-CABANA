/**
 * Mock API Adapter
 * Simulates network requests with configurable delays and error injection
 * Provides identical interface to production API to avoid drift
 */

import type {
  ApiResponse,
  PaginatedResponse,
  User,
  LoginCredentials,
  SignupData,
  Post,
  CreatePostData,
  Comment,
  Subscription,
  Transaction,
  TipData,
  Conversation,
  Message,
  SendMessageData,
  Notification,
  CreatorAnalytics,
} from '../../types';
import {
  dbUsers,
  dbPosts,
  dbComments,
  dbSubscriptions,
  dbTransactions,
  dbConversations,
  dbMessages,
  dbNotifications,
  dbAnalytics,
} from './database';
import { createPost, createComment, createTransaction, createMessage, createNotification } from './factories';

// ============================================================================
// API CONFIGURATION
// ============================================================================

export interface MockApiConfig {
  enableNetworkDelay: boolean;
  minDelayMs: number;
  maxDelayMs: number;
  enableRandomErrors: boolean;
  errorRate: number; // 0-1
}

let apiConfig: MockApiConfig = {
  enableNetworkDelay: true,
  minDelayMs: 300,
  maxDelayMs: 1000,
  enableRandomErrors: false,
  errorRate: 0.1,
};

export const setApiConfig = (config: Partial<MockApiConfig>) => {
  apiConfig = { ...apiConfig, ...config };
};

export const getApiConfig = () => apiConfig;

// ============================================================================
// HELPERS
// ============================================================================

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const randomDelay = async (): Promise<void> => {
  if (!apiConfig.enableNetworkDelay) return;
  const ms =
    Math.random() * (apiConfig.maxDelayMs - apiConfig.minDelayMs) + apiConfig.minDelayMs;
  await delay(ms);
};

const shouldSimulateError = (): boolean => {
  if (!apiConfig.enableRandomErrors) return false;
  return Math.random() < apiConfig.errorRate;
};

const simulateError = <T>(): ApiResponse<T> => {
  const errors = [
    'Network connection failed',
    'Server timeout',
    'Service temporarily unavailable',
    'Rate limit exceeded',
  ];
  return {
    success: false,
    error: errors[Math.floor(Math.random() * errors.length)],
  };
};

const successResponse = <T>(data: T, message?: string): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};

const errorResponse = <T>(error: string): ApiResponse<T> => {
  return {
    success: false,
    error,
  };
};

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export const mockAuthApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const user = dbUsers.getByEmail(credentials.email);
    if (!user) {
      return errorResponse('Invalid email or password');
    }

    // In mock mode, accept any password for demo accounts
    // In production, this would verify hashed password
    const isDemoAccount = credentials.email.endsWith('@cabana.demo');
    if (!isDemoAccount && credentials.password !== 'demo123') {
      return errorResponse('Invalid email or password');
    }

    const token = `mock-token-${user.id}-${Date.now()}`;
    return successResponse({ user, token }, 'Login successful');
  },

  /**
   * Signup new user
   */
  signup: async (data: SignupData): Promise<ApiResponse<{ user: User; token: string }>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    // Check if email or username already exists
    if (dbUsers.getByEmail(data.email)) {
      return errorResponse('Email already registered');
    }
    if (dbUsers.getByUsername(data.username)) {
      return errorResponse('Username already taken');
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      email: data.email,
      username: data.username,
      displayName: data.displayName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      bio: '',
      role: data.role,
      subscriptionTier: 'free',
      isVerified: false,
      createdAt: new Date().toISOString(),
      ...(data.role === 'creator'
        ? { isCreator: true, subscriberCount: 0, totalEarnings: 0 }
        : { followingCount: 0, subscriptions: [] }),
    };

    dbUsers.create(newUser);

    const token = `mock-token-${newUser.id}-${Date.now()}`;
    return successResponse({ user: newUser, token }, 'Account created successfully');
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (token: string): Promise<ApiResponse<User>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    // Extract user ID from token
    const userId = token.split('-')[2];
    const user = dbUsers.getById(userId);

    if (!user) {
      return errorResponse('Invalid session');
    }

    return successResponse(user);
  },

  /**
   * Logout
   */
  logout: async (): Promise<ApiResponse<null>> => {
    await randomDelay();
    return successResponse(null, 'Logged out successfully');
  },
};

// ============================================================================
// USER API
// ============================================================================

export const mockUserApi = {
  /**
   * Get user by ID
   */
  getUser: async (userId: string): Promise<ApiResponse<User>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const user = dbUsers.getById(userId);
    if (!user) {
      return errorResponse('User not found');
    }

    return successResponse(user);
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId: string, updates: Partial<User>): Promise<ApiResponse<User>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const updated = dbUsers.update(userId, updates);
    if (!updated) {
      return errorResponse('User not found');
    }

    return successResponse(updated, 'Profile updated successfully');
  },

  /**
   * Get all creators
   */
  getCreators: async (): Promise<ApiResponse<User[]>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const creators = dbUsers.getCreators();
    return successResponse(creators);
  },
};

// ============================================================================
// POST API
// ============================================================================

export const mockPostApi = {
  /**
   * Get feed for user
   */
  getFeed: async (userId: string, page: number = 1, pageSize: number = 20): Promise<ApiResponse<PaginatedResponse<Post>>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const allPosts = dbPosts.getFeed(userId, pageSize * page);
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const paginatedPosts = allPosts.slice(startIdx, endIdx);

    return successResponse({
      data: paginatedPosts,
      page,
      pageSize,
      total: allPosts.length,
      hasMore: endIdx < allPosts.length,
    });
  },

  /**
   * Get post by ID
   */
  getPost: async (postId: string): Promise<ApiResponse<Post>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const post = dbPosts.getById(postId);
    if (!post) {
      return errorResponse('Post not found');
    }

    return successResponse(post);
  },

  /**
   * Get posts by creator
   */
  getPostsByCreator: async (creatorId: string): Promise<ApiResponse<Post[]>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const posts = dbPosts.getByCreator(creatorId);
    return successResponse(posts);
  },

  /**
   * Create new post
   */
  createPost: async (userId: string, data: CreatePostData): Promise<ApiResponse<Post>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const user = dbUsers.getById(userId);
    if (!user) {
      return errorResponse('User not found');
    }

    // Simulate file upload by creating mock media URLs
    const mediaUrls = data.media.map((file, idx) => ({
      id: `media-${Date.now()}-${idx}`,
      type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
      url: URL.createObjectURL(file), // Create temporary URL for preview
      thumbnail: URL.createObjectURL(file),
      width: 1920,
      height: 1080,
    }));

    const newPost = createPost(userId, user, {
      content: data.content,
      media: mediaUrls,
      visibility: data.visibility,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    dbPosts.create(newPost);

    return successResponse(newPost, 'Post created successfully');
  },

  /**
   * Delete post
   */
  deletePost: async (postId: string, userId: string): Promise<ApiResponse<null>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const post = dbPosts.getById(postId);
    if (!post) {
      return errorResponse('Post not found');
    }

    if (post.creatorId !== userId) {
      return errorResponse('Unauthorized');
    }

    dbPosts.delete(postId);
    return successResponse(null, 'Post deleted successfully');
  },

  /**
   * Toggle like on post
   */
  toggleLike: async (postId: string): Promise<ApiResponse<Post>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const post = dbPosts.toggleLike(postId);
    if (!post) {
      return errorResponse('Post not found');
    }

    return successResponse(post);
  },

  /**
   * Get comments for post
   */
  getComments: async (postId: string): Promise<ApiResponse<Comment[]>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const comments = dbComments.getByPost(postId);
    return successResponse(comments);
  },

  /**
   * Add comment to post
   */
  addComment: async (postId: string, userId: string, content: string): Promise<ApiResponse<Comment>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const user = dbUsers.getById(userId);
    if (!user) {
      return errorResponse('User not found');
    }

    const post = dbPosts.getById(postId);
    if (!post) {
      return errorResponse('Post not found');
    }

    const comment = createComment(postId, userId, user, {
      content,
      createdAt: new Date().toISOString(),
    });

    dbComments.create(comment);

    return successResponse(comment, 'Comment added successfully');
  },
};

// ============================================================================
// SUBSCRIPTION API
// ============================================================================

export const mockSubscriptionApi = {
  /**
   * Get subscriptions for user (as fan)
   */
  getMySubscriptions: async (userId: string): Promise<ApiResponse<Subscription[]>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const subscriptions = dbSubscriptions.getByFan(userId);
    return successResponse(subscriptions);
  },

  /**
   * Get subscribers for creator
   */
  getSubscribers: async (creatorId: string): Promise<ApiResponse<Subscription[]>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const subscriptions = dbSubscriptions.getByCreator(creatorId);
    return successResponse(subscriptions);
  },

  /**
   * Subscribe to creator
   */
  subscribe: async (fanId: string, creatorId: string, tier: 'creator' | 'icon'): Promise<ApiResponse<Subscription>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const fan = dbUsers.getById(fanId);
    const creator = dbUsers.getById(creatorId);

    if (!fan || !creator) {
      return errorResponse('User not found');
    }

    if (dbSubscriptions.isSubscribed(fanId, creatorId)) {
      return errorResponse('Already subscribed');
    }

    const amount = tier === 'creator' ? 9.99 : 29.99;
    const subscription: Subscription = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      fanId,
      creatorId,
      fan,
      creator,
      tier,
      amount,
      status: 'active',
      startDate: new Date().toISOString(),
      autoRenew: true,
    };

    dbSubscriptions.create(subscription);

    // Create transaction
    dbTransactions.create(
      createTransaction(fanId, creatorId, {
        type: 'subscription',
        amount,
        status: 'completed',
        description: `${tier} tier subscription`,
      })
    );

    // Create notification
    dbNotifications.create(
      createNotification(creatorId, {
        type: 'new_subscriber',
        title: 'New Subscriber',
        message: `${fan.displayName} just subscribed to your ${tier} tier!`,
        isRead: false,
      })
    );

    return successResponse(subscription, 'Subscribed successfully');
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (subscriptionId: string): Promise<ApiResponse<Subscription>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const subscription = dbSubscriptions.cancel(subscriptionId);
    if (!subscription) {
      return errorResponse('Subscription not found');
    }

    return successResponse(subscription, 'Subscription cancelled');
  },
};

// ============================================================================
// TRANSACTION API
// ============================================================================

export const mockTransactionApi = {
  /**
   * Get transactions for user
   */
  getTransactions: async (userId: string): Promise<ApiResponse<Transaction[]>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const transactions = dbTransactions.getByUser(userId);
    return successResponse(transactions);
  },

  /**
   * Send tip to creator
   */
  sendTip: async (fanId: string, data: TipData): Promise<ApiResponse<Transaction>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const fan = dbUsers.getById(fanId);
    const creator = dbUsers.getById(data.creatorId);

    if (!fan || !creator) {
      return errorResponse('User not found');
    }

    const transaction = createTransaction(fanId, data.creatorId, {
      type: 'tip',
      amount: data.amount,
      status: 'completed',
      description: data.message || 'Tip from fan',
    });

    dbTransactions.create(transaction);

    // Create notification
    dbNotifications.create(
      createNotification(data.creatorId, {
        type: 'new_tip',
        title: 'New Tip',
        message: `You received a $${data.amount} tip from ${fan.displayName}!`,
        isRead: false,
      })
    );

    return successResponse(transaction, 'Tip sent successfully');
  },
};

// ============================================================================
// MESSAGING API
// ============================================================================

export const mockMessagingApi = {
  /**
   * Get conversations for user
   */
  getConversations: async (userId: string): Promise<ApiResponse<Conversation[]>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const conversations = dbConversations.getByUser(userId);
    return successResponse(conversations);
  },

  /**
   * Get messages in conversation
   */
  getMessages: async (conversationId: string): Promise<ApiResponse<Message[]>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const messages = dbMessages.getByConversation(conversationId);
    return successResponse(messages);
  },

  /**
   * Send message
   */
  sendMessage: async (userId: string, data: SendMessageData): Promise<ApiResponse<Message>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const user = dbUsers.getById(userId);
    if (!user) {
      return errorResponse('User not found');
    }

    const message = createMessage(data.conversationId, userId, user, {
      content: data.content,
      createdAt: new Date().toISOString(),
    });

    dbMessages.create(message);

    return successResponse(message, 'Message sent');
  },

  /**
   * Mark messages as read
   */
  markAsRead: async (conversationId: string, userId: string): Promise<ApiResponse<null>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    dbMessages.markAsRead(conversationId, userId);
    return successResponse(null);
  },
};

// ============================================================================
// NOTIFICATION API
// ============================================================================

export const mockNotificationApi = {
  /**
   * Get notifications for user
   */
  getNotifications: async (userId: string): Promise<ApiResponse<Notification[]>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const notifications = dbNotifications.getByUser(userId);
    return successResponse(notifications);
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId: string): Promise<ApiResponse<Notification>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const notification = dbNotifications.markAsRead(notificationId);
    if (!notification) {
      return errorResponse('Notification not found');
    }

    return successResponse(notification);
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (userId: string): Promise<ApiResponse<null>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    dbNotifications.markAllAsRead(userId);
    return successResponse(null);
  },
};

// ============================================================================
// ANALYTICS API
// ============================================================================

export const mockAnalyticsApi = {
  /**
   * Get analytics for creator
   */
  getAnalytics: async (
    creatorId: string,
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<ApiResponse<CreatorAnalytics>> => {
    await randomDelay();
    if (shouldSimulateError()) return simulateError();

    const analytics = dbAnalytics.getByCreator(creatorId);
    if (!analytics) {
      return errorResponse('Analytics not found');
    }

    return successResponse(analytics);
  },
};
