/**
 * In-Memory Mock Database
 * Provides CRUD operations with deterministic seeded data
 */

import type {
  User,
  Post,
  Comment,
  Transaction,
  Subscription,
  Message,
  Conversation,
  Notification,
  CreatorAnalytics,
} from '../../types';

// ============================================================================
// DATABASE INTERFACE
// ============================================================================

export interface MockDatabase {
  users: Map<string, User>;
  posts: Map<string, Post>;
  comments: Map<string, Comment>;
  transactions: Map<string, Transaction>;
  subscriptions: Map<string, Subscription>;
  messages: Map<string, Message>;
  conversations: Map<string, Conversation>;
  notifications: Map<string, Notification>;
  analytics: Map<string, CreatorAnalytics>;
  // Indexes for efficient queries
  postsByCreator: Map<string, string[]>;
  commentsByPost: Map<string, string[]>;
  conversationsByUser: Map<string, string[]>;
  subscriptionsByCreator: Map<string, string[]>;
  subscriptionsByFan: Map<string, string[]>;
}

// ============================================================================
// SINGLETON DATABASE INSTANCE
// ============================================================================

let dbInstance: MockDatabase | null = null;

export const initializeDatabase = (): MockDatabase => {
  dbInstance = {
    users: new Map(),
    posts: new Map(),
    comments: new Map(),
    transactions: new Map(),
    subscriptions: new Map(),
    messages: new Map(),
    conversations: new Map(),
    notifications: new Map(),
    analytics: new Map(),
    // Indexes
    postsByCreator: new Map(),
    commentsByPost: new Map(),
    conversationsByUser: new Map(),
    subscriptionsByCreator: new Map(),
    subscriptionsByFan: new Map(),
  };
  return dbInstance;
};

export const getDatabase = (): MockDatabase => {
  if (!dbInstance) {
    return initializeDatabase();
  }
  return dbInstance;
};

export const resetDatabase = (): MockDatabase => {
  return initializeDatabase();
};

// ============================================================================
// CRUD HELPERS
// ============================================================================

/**
 * User Operations
 */
export const dbUsers = {
  getAll: (): User[] => {
    const db = getDatabase();
    return Array.from(db.users.values());
  },

  getById: (id: string): User | undefined => {
    const db = getDatabase();
    return db.users.get(id);
  },

  getByEmail: (email: string): User | undefined => {
    const db = getDatabase();
    return dbUsers.getAll().find((u) => u.email === email);
  },

  getByUsername: (username: string): User | undefined => {
    const db = getDatabase();
    return dbUsers.getAll().find((u) => u.username === username);
  },

  getCreators: (): User[] => {
    return dbUsers.getAll().filter((u) => u.role === 'creator');
  },

  create: (user: User): User => {
    const db = getDatabase();
    db.users.set(user.id, user);
    return user;
  },

  update: (id: string, updates: Partial<User>): User | undefined => {
    const db = getDatabase();
    const user = db.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    db.users.set(id, updated);
    return updated;
  },

  delete: (id: string): boolean => {
    const db = getDatabase();
    return db.users.delete(id);
  },
};

/**
 * Post Operations
 */
export const dbPosts = {
  getAll: (): Post[] => {
    const db = getDatabase();
    return Array.from(db.posts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getById: (id: string): Post | undefined => {
    const db = getDatabase();
    return db.posts.get(id);
  },

  getByCreator: (creatorId: string): Post[] => {
    const db = getDatabase();
    const postIds = db.postsByCreator.get(creatorId) || [];
    return postIds
      .map((id) => db.posts.get(id))
      .filter((p): p is Post => p !== undefined)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getFeed: (userId: string, limit: number = 20): Post[] => {
    // Get posts from creators the user subscribes to + public posts
    const user = dbUsers.getById(userId);
    if (!user) return [];

    const subscribedCreatorIds = user.subscriptions || [];
    const allPosts = dbPosts.getAll();

    return allPosts
      .filter((post) => {
        // Include public posts
        if (post.visibility === 'public') return true;
        // Include posts from subscribed creators
        if (subscribedCreatorIds.includes(post.creatorId)) return true;
        // Include user's own posts
        if (post.creatorId === userId) return true;
        return false;
      })
      .slice(0, limit);
  },

  create: (post: Post): Post => {
    const db = getDatabase();
    db.posts.set(post.id, post);

    // Update index
    const creatorPosts = db.postsByCreator.get(post.creatorId) || [];
    creatorPosts.unshift(post.id);
    db.postsByCreator.set(post.creatorId, creatorPosts);

    return post;
  },

  update: (id: string, updates: Partial<Post>): Post | undefined => {
    const db = getDatabase();
    const post = db.posts.get(id);
    if (!post) return undefined;
    const updated = { ...post, ...updates };
    db.posts.set(id, updated);
    return updated;
  },

  delete: (id: string): boolean => {
    const db = getDatabase();
    const post = db.posts.get(id);
    if (!post) return false;

    // Update index
    const creatorPosts = db.postsByCreator.get(post.creatorId) || [];
    const filtered = creatorPosts.filter((pid) => pid !== id);
    db.postsByCreator.set(post.creatorId, filtered);

    return db.posts.delete(id);
  },

  toggleLike: (postId: string): Post | undefined => {
    const db = getDatabase();
    const post = db.posts.get(postId);
    if (!post) return undefined;

    const updated = {
      ...post,
      isLiked: !post.isLiked,
      likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
    };
    db.posts.set(postId, updated);
    return updated;
  },
};

/**
 * Comment Operations
 */
export const dbComments = {
  getByPost: (postId: string): Comment[] => {
    const db = getDatabase();
    const commentIds = db.commentsByPost.get(postId) || [];
    return commentIds
      .map((id) => db.comments.get(id))
      .filter((c): c is Comment => c !== undefined)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  create: (comment: Comment): Comment => {
    const db = getDatabase();
    db.comments.set(comment.id, comment);

    // Update index
    const postComments = db.commentsByPost.get(comment.postId) || [];
    postComments.push(comment.id);
    db.commentsByPost.set(comment.postId, postComments);

    // Increment post comment count
    const post = db.posts.get(comment.postId);
    if (post) {
      db.posts.set(comment.postId, { ...post, commentCount: post.commentCount + 1 });
    }

    return comment;
  },

  delete: (id: string): boolean => {
    const db = getDatabase();
    const comment = db.comments.get(id);
    if (!comment) return false;

    // Update index
    const postComments = db.commentsByPost.get(comment.postId) || [];
    const filtered = postComments.filter((cid) => cid !== id);
    db.commentsByPost.set(comment.postId, filtered);

    // Decrement post comment count
    const post = db.posts.get(comment.postId);
    if (post && post.commentCount > 0) {
      db.posts.set(comment.postId, { ...post, commentCount: post.commentCount - 1 });
    }

    return db.comments.delete(id);
  },
};

/**
 * Subscription Operations
 */
export const dbSubscriptions = {
  getByCreator: (creatorId: string): Subscription[] => {
    const db = getDatabase();
    const subIds = db.subscriptionsByCreator.get(creatorId) || [];
    return subIds
      .map((id) => db.subscriptions.get(id))
      .filter((s): s is Subscription => s !== undefined);
  },

  getByFan: (fanId: string): Subscription[] => {
    const db = getDatabase();
    const subIds = db.subscriptionsByFan.get(fanId) || [];
    return subIds
      .map((id) => db.subscriptions.get(id))
      .filter((s): s is Subscription => s !== undefined);
  },

  isSubscribed: (fanId: string, creatorId: string): boolean => {
    const subs = dbSubscriptions.getByFan(fanId);
    return subs.some((s) => s.creatorId === creatorId && s.status === 'active');
  },

  create: (subscription: Subscription): Subscription => {
    const db = getDatabase();
    db.subscriptions.set(subscription.id, subscription);

    // Update indexes
    const creatorSubs = db.subscriptionsByCreator.get(subscription.creatorId) || [];
    creatorSubs.push(subscription.id);
    db.subscriptionsByCreator.set(subscription.creatorId, creatorSubs);

    const fanSubs = db.subscriptionsByFan.get(subscription.fanId) || [];
    fanSubs.push(subscription.id);
    db.subscriptionsByFan.set(subscription.fanId, fanSubs);

    // Update user subscription list
    const fan = dbUsers.getById(subscription.fanId);
    if (fan) {
      const subs = fan.subscriptions || [];
      dbUsers.update(fan.id, { subscriptions: [...subs, subscription.creatorId] });
    }

    // Update creator subscriber count
    const creator = dbUsers.getById(subscription.creatorId);
    if (creator) {
      dbUsers.update(creator.id, {
        subscriberCount: (creator.subscriberCount || 0) + 1,
      });
    }

    return subscription;
  },

  cancel: (id: string): Subscription | undefined => {
    const db = getDatabase();
    const sub = db.subscriptions.get(id);
    if (!sub) return undefined;

    const updated = { ...sub, status: 'cancelled' as const };
    db.subscriptions.set(id, updated);

    // Update user subscription list
    const fan = dbUsers.getById(sub.fanId);
    if (fan) {
      const subs = (fan.subscriptions || []).filter((cid) => cid !== sub.creatorId);
      dbUsers.update(fan.id, { subscriptions: subs });
    }

    // Update creator subscriber count
    const creator = dbUsers.getById(sub.creatorId);
    if (creator && creator.subscriberCount && creator.subscriberCount > 0) {
      dbUsers.update(creator.id, {
        subscriberCount: creator.subscriberCount - 1,
      });
    }

    return updated;
  },
};

/**
 * Transaction Operations
 */
export const dbTransactions = {
  getByUser: (userId: string): Transaction[] => {
    const db = getDatabase();
    return Array.from(db.transactions.values())
      .filter((t) => t.fromUserId === userId || t.toUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getByCreator: (creatorId: string): Transaction[] => {
    const db = getDatabase();
    return Array.from(db.transactions.values())
      .filter((t) => t.toUserId === creatorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  create: (transaction: Transaction): Transaction => {
    const db = getDatabase();
    db.transactions.set(transaction.id, transaction);

    // Update creator earnings
    if (transaction.toUserId && transaction.status === 'completed') {
      const creator = dbUsers.getById(transaction.toUserId);
      if (creator) {
        dbUsers.update(creator.id, {
          totalEarnings: (creator.totalEarnings || 0) + transaction.amount,
        });
      }
    }

    return transaction;
  },
};

/**
 * Conversation & Message Operations
 */
export const dbConversations = {
  getByUser: (userId: string): Conversation[] => {
    const db = getDatabase();
    const convIds = db.conversationsByUser.get(userId) || [];
    return convIds
      .map((id) => db.conversations.get(id))
      .filter((c): c is Conversation => c !== undefined)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  getById: (id: string): Conversation | undefined => {
    const db = getDatabase();
    return db.conversations.get(id);
  },

  create: (conversation: Conversation): Conversation => {
    const db = getDatabase();
    db.conversations.set(conversation.id, conversation);

    // Update index
    conversation.participants.forEach((p) => {
      const userConvs = db.conversationsByUser.get(p.id) || [];
      userConvs.push(conversation.id);
      db.conversationsByUser.set(p.id, userConvs);
    });

    return conversation;
  },

  update: (id: string, updates: Partial<Conversation>): Conversation | undefined => {
    const db = getDatabase();
    const conv = db.conversations.get(id);
    if (!conv) return undefined;
    const updated = { ...conv, ...updates };
    db.conversations.set(id, updated);
    return updated;
  },
};

export const dbMessages = {
  getByConversation: (conversationId: string): Message[] => {
    const db = getDatabase();
    return Array.from(db.messages.values())
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  create: (message: Message): Message => {
    const db = getDatabase();
    db.messages.set(message.id, message);

    // Update conversation
    const conv = dbConversations.getById(message.conversationId);
    if (conv) {
      dbConversations.update(message.conversationId, {
        lastMessage: message,
        updatedAt: message.createdAt,
        unreadCount: conv.unreadCount + 1,
      });
    }

    return message;
  },

  markAsRead: (conversationId: string, userId: string): void => {
    const db = getDatabase();
    const messages = dbMessages.getByConversation(conversationId);

    messages.forEach((msg) => {
      if (msg.senderId !== userId && !msg.isRead) {
        db.messages.set(msg.id, { ...msg, isRead: true });
      }
    });

    // Reset unread count
    dbConversations.update(conversationId, { unreadCount: 0 });
  },
};

/**
 * Notification Operations
 */
export const dbNotifications = {
  getByUser: (userId: string): Notification[] => {
    const db = getDatabase();
    return Array.from(db.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  create: (notification: Notification): Notification => {
    const db = getDatabase();
    db.notifications.set(notification.id, notification);
    return notification;
  },

  markAsRead: (id: string): Notification | undefined => {
    const db = getDatabase();
    const notif = db.notifications.get(id);
    if (!notif) return undefined;
    const updated = { ...notif, isRead: true };
    db.notifications.set(id, updated);
    return updated;
  },

  markAllAsRead: (userId: string): void => {
    const db = getDatabase();
    const notifications = dbNotifications.getByUser(userId);
    notifications.forEach((n) => {
      db.notifications.set(n.id, { ...n, isRead: true });
    });
  },
};

/**
 * Analytics Operations
 */
export const dbAnalytics = {
  getByCreator: (creatorId: string): CreatorAnalytics | undefined => {
    const db = getDatabase();
    return db.analytics.get(creatorId);
  },

  set: (creatorId: string, analytics: CreatorAnalytics): void => {
    const db = getDatabase();
    db.analytics.set(creatorId, analytics);
  },
};
