/**
 * Core Type Definitions for Cabana Demo
 * All types mirror production API shapes to avoid drift
 */

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export type UserRole = 'creator' | 'fan' | 'admin';

export type SubscriptionTier = 'free' | 'creator' | 'icon';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  isVerified: boolean;
  createdAt: string;
  // Creator-specific fields
  isCreator?: boolean;
  subscriberCount?: number;
  totalEarnings?: number;
  // Fan-specific fields
  followingCount?: number;
  subscriptions?: string[]; // Creator IDs
}

export interface AuthSession {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  username: string;
  displayName: string;
  role: UserRole;
}

// ============================================================================
// CONTENT & POSTS
// ============================================================================

export type PostVisibility = 'public' | 'subscribers' | 'icon-only';

export type MediaType = 'image' | 'video' | 'audio';

export interface Media {
  id: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  duration?: number; // For video/audio in seconds
  width?: number;
  height?: number;
}

export interface Post {
  id: string;
  creatorId: string;
  creator: User;
  content: string;
  media: Media[];
  visibility: PostVisibility;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface CreatePostData {
  content: string;
  media: File[];
  visibility: PostVisibility;
}

// ============================================================================
// MONETIZATION
// ============================================================================

export type TransactionType = 'subscription' | 'tip' | 'payout';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  fromUserId: string;
  toUserId: string;
  fromUser?: User;
  toUser?: User;
  description: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  fanId: string;
  creatorId: string;
  fan: User;
  creator: User;
  tier: SubscriptionTier;
  amount: number;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
}

export interface TipData {
  creatorId: string;
  amount: number;
  message?: string;
}

// ============================================================================
// MESSAGING
// ============================================================================

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  media?: Media[];
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageData {
  conversationId: string;
  content: string;
  media?: File[];
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface CreatorAnalytics {
  userId: string;
  period: 'day' | 'week' | 'month' | 'year';
  // Revenue
  totalRevenue: number;
  subscriptionRevenue: number;
  tipRevenue: number;
  revenueChange: number; // Percentage change
  // Subscribers
  totalSubscribers: number;
  newSubscribers: number;
  subscriberChange: number;
  // Engagement
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
  // Posts
  totalPosts: number;
  postsThisPeriod: number;
  // Time series data
  revenueByDay: { date: string; amount: number }[];
  subscribersByDay: { date: string; count: number }[];
  viewsByDay: { date: string; count: number }[];
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export type NotificationType =
  | 'new_subscriber'
  | 'new_tip'
  | 'new_comment'
  | 'new_like'
  | 'new_message';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ============================================================================
// DEMO CONTROLS
// ============================================================================

export interface DemoPersona {
  id: string;
  name: string;
  description: string;
  userId: string;
  avatar: string;
  role: UserRole;
}

export interface DemoSettings {
  currentPersona: string | null;
  enableNetworkDelay: boolean;
  networkDelayMs: number;
  enableRandomErrors: boolean;
  errorRate: number; // 0-1
  enableToasts: boolean;
  seed: number;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// ============================================================================
// FORM STATES
// ============================================================================

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
