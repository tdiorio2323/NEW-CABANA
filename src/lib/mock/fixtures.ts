/**
 * Seeded Demo Fixtures
 * Pre-defined personas and sample data for consistent demos
 */

import type { User, DemoPersona } from '../../types';
import {
  setSeed,
  createUser,
  createPost,
  createComment,
  createSubscription,
  createTransaction,
  createConversation,
  createMessage,
  createNotification,
  createCreatorAnalytics,
  createUsers,
  createPosts,
} from './factories';
import {
  initializeDatabase,
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

// ============================================================================
// DEMO PERSONAS
// ============================================================================

export const DEMO_PERSONAS: Record<string, DemoPersona> = {
  CREATOR_SOPHIA: {
    id: 'persona-creator-sophia',
    name: 'Sophia (Creator)',
    description: 'Established luxury lifestyle creator with 2.5K subscribers',
    userId: 'user-sophia-creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    role: 'creator',
  },
  CREATOR_MARCUS: {
    id: 'persona-creator-marcus',
    name: 'Marcus (Creator)',
    description: 'Rising nightlife photographer and event host',
    userId: 'user-marcus-creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    role: 'creator',
  },
  FAN_EMMA: {
    id: 'persona-fan-emma',
    name: 'Emma (Fan)',
    description: 'Active subscriber following 12 creators',
    userId: 'user-emma-fan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    role: 'fan',
  },
  ADMIN_ALEX: {
    id: 'persona-admin-alex',
    name: 'Alex (Admin)',
    description: 'Platform administrator with full access',
    userId: 'user-alex-admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'admin',
  },
};

// ============================================================================
// SEEDED USERS
// ============================================================================

const createSeededUsers = (): User[] => {
  // Main demo personas
  const sophia = createUser({
    id: DEMO_PERSONAS.CREATOR_SOPHIA.userId,
    email: 'sophia@cabana.demo',
    username: 'sophia_luxury',
    displayName: 'Sophia Laurent',
    avatar: DEMO_PERSONAS.CREATOR_SOPHIA.avatar,
    bio: '✨ Luxury lifestyle & nightlife curator | VIP event host | Cabana Icon tier creator',
    role: 'creator',
    subscriptionTier: 'icon',
    isVerified: true,
    isCreator: true,
    subscriberCount: 2547,
    totalEarnings: 45320.50,
  });

  const marcus = createUser({
    id: DEMO_PERSONAS.CREATOR_MARCUS.userId,
    email: 'marcus@cabana.demo',
    username: 'marcus_nights',
    displayName: 'Marcus Chen',
    avatar: DEMO_PERSONAS.CREATOR_MARCUS.avatar,
    bio: '📸 Nightlife photographer | Event host | Capturing the magic of LA nights',
    role: 'creator',
    subscriptionTier: 'creator',
    isVerified: true,
    isCreator: true,
    subscriberCount: 892,
    totalEarnings: 12450.25,
  });

  const emma = createUser({
    id: DEMO_PERSONAS.FAN_EMMA.userId,
    email: 'emma@cabana.demo',
    username: 'emma_vip',
    displayName: 'Emma Rodriguez',
    avatar: DEMO_PERSONAS.FAN_EMMA.avatar,
    bio: 'Living my best life ✨ | VIP enthusiast | Cabana member',
    role: 'fan',
    subscriptionTier: 'creator',
    isVerified: false,
    followingCount: 12,
    subscriptions: [sophia.id, marcus.id],
  });

  const alex = createUser({
    id: DEMO_PERSONAS.ADMIN_ALEX.userId,
    email: 'alex@cabana.demo',
    username: 'admin_alex',
    displayName: 'Alex Kim',
    avatar: DEMO_PERSONAS.ADMIN_ALEX.avatar,
    bio: 'Cabana Platform Administrator',
    role: 'admin',
    subscriptionTier: 'icon',
    isVerified: true,
  });

  return [sophia, marcus, emma, alex];
};

// ============================================================================
// SEED DATABASE FUNCTION
// ============================================================================

export const seedDatabase = (seed: number = 42): void => {
  console.log(`[Mock DB] Seeding database with seed: ${seed}`);
  setSeed(seed);

  // Reset database
  initializeDatabase();

  // Create main personas
  const [sophia, marcus, emma, alex] = createSeededUsers();
  dbUsers.create(sophia);
  dbUsers.create(marcus);
  dbUsers.create(emma);
  dbUsers.create(alex);

  // Create additional creators (5 more)
  const additionalCreators = createUsers(5, 'creator');
  additionalCreators.forEach((user) => dbUsers.create(user));

  // Create additional fans (10 more)
  const additionalFans = createUsers(10, 'fan');
  additionalFans.forEach((user) => dbUsers.create(user));

  // Get all users for relationships
  const allCreators = [sophia, marcus, ...additionalCreators];
  const allFans = [emma, ...additionalFans];
  const allUsers = [...allCreators, ...allFans, alex];

  // ========================================================================
  // POSTS & COMMENTS
  // ========================================================================

  // Create posts for Sophia (8 posts)
  const sophiaPosts = createPosts(8, sophia);
  sophiaPosts.forEach((post, idx) => {
    // Make some posts exclusive
    if (idx === 0) {
      post.visibility = 'icon-only';
      post.isPinned = true;
      post.content = '🎉 ICON MEMBERS ONLY: Behind the scenes at last night\'s exclusive rooftop event! Thank you all for the incredible support ✨';
    }
    if (idx === 1) {
      post.visibility = 'subscribers';
      post.content = 'Subscriber exclusive: My top 5 luxury venues in LA this season! Which one should I feature next? 💎';
    }
    dbPosts.create(post);

    // Add comments to first 3 posts
    if (idx < 3) {
      const comments = [emma, ...allFans.slice(0, 3)].map((fan) =>
        createComment(post.id, fan.id, fan, {
          content: idx === 0 ? 'This looks absolutely stunning! 😍' : 'Amazing content as always! 🔥',
        })
      );
      comments.forEach((c) => dbComments.create(c));
    }
  });

  // Create posts for Marcus (6 posts)
  const marcusPosts = createPosts(6, marcus);
  marcusPosts.forEach((post, idx) => {
    if (idx === 0) {
      post.visibility = 'subscribers';
      post.isPinned = true;
      post.content = '📸 New photo series dropping soon! Subscribers get early access to my latest nightlife collection.';
    }
    dbPosts.create(post);

    // Add comments
    if (idx < 2) {
      const comments = [emma, allFans[0]].map((fan) =>
        createComment(post.id, fan.id, fan)
      );
      comments.forEach((c) => dbComments.create(c));
    }
  });

  // Create posts for other creators (3 posts each)
  additionalCreators.forEach((creator) => {
    const posts = createPosts(3, creator);
    posts.forEach((post) => dbPosts.create(post));
  });

  // ========================================================================
  // SUBSCRIPTIONS
  // ========================================================================

  // Emma subscribes to Sophia (Icon tier)
  const emmaSophiaSub = createSubscription(emma.id, sophia.id, emma, sophia, {
    tier: 'icon',
    amount: 29.99,
    status: 'active',
    autoRenew: true,
  });
  dbSubscriptions.create(emmaSophiaSub);

  // Emma subscribes to Marcus (Creator tier)
  const emmaMarcusSub = createSubscription(emma.id, marcus.id, emma, marcus, {
    tier: 'creator',
    amount: 9.99,
    status: 'active',
    autoRenew: true,
  });
  dbSubscriptions.create(emmaMarcusSub);

  // Other fans subscribe to creators
  allFans.slice(0, 5).forEach((fan, idx) => {
    const creator = allCreators[idx % allCreators.length];
    const sub = createSubscription(fan.id, creator.id, fan, creator, {
      status: 'active',
    });
    dbSubscriptions.create(sub);
  });

  // ========================================================================
  // TRANSACTIONS
  // ========================================================================

  // Subscription payments
  dbTransactions.create(
    createTransaction(emma.id, sophia.id, {
      type: 'subscription',
      amount: 29.99,
      status: 'completed',
      description: 'Icon tier monthly subscription',
    })
  );

  dbTransactions.create(
    createTransaction(emma.id, marcus.id, {
      type: 'subscription',
      amount: 9.99,
      status: 'completed',
      description: 'Creator tier monthly subscription',
    })
  );

  // Tips
  dbTransactions.create(
    createTransaction(emma.id, sophia.id, {
      type: 'tip',
      amount: 50.00,
      status: 'completed',
      description: 'Tip from fan',
    })
  );

  dbTransactions.create(
    createTransaction(allFans[1].id, marcus.id, {
      type: 'tip',
      amount: 25.00,
      status: 'completed',
      description: 'Tip from fan',
    })
  );

  // Generate transaction history for Sophia
  for (let i = 0; i < 20; i++) {
    const fan = allFans[i % allFans.length];
    dbTransactions.create(createTransaction(fan.id, sophia.id));
  }

  // ========================================================================
  // CONVERSATIONS & MESSAGES
  // ========================================================================

  // Conversation between Emma and Sophia
  const emmaSophiaConv = createConversation([emma, sophia], {
    id: 'conv-emma-sophia',
  });
  dbConversations.create(emmaSophiaConv);

  // Messages in conversation
  const messages = [
    createMessage(emmaSophiaConv.id, emma.id, emma, {
      content: 'Hi Sophia! Loved your recent post about the rooftop event 😍',
      isRead: true,
    }),
    createMessage(emmaSophiaConv.id, sophia.id, sophia, {
      content: 'Thank you so much Emma! ✨ So glad you enjoyed it!',
      isRead: true,
    }),
    createMessage(emmaSophiaConv.id, emma.id, emma, {
      content: 'Will you be hosting another event soon? I\'d love to attend!',
      isRead: false,
    }),
  ];
  messages.forEach((msg) => dbMessages.create(msg));

  // Conversation between Emma and Marcus
  const emmaMarcusConv = createConversation([emma, marcus], {
    id: 'conv-emma-marcus',
  });
  dbConversations.create(emmaMarcusConv);

  const marcusMessages = [
    createMessage(emmaMarcusConv.id, emma.id, emma, {
      content: 'Your photography is incredible! 📸',
      isRead: true,
    }),
    createMessage(emmaMarcusConv.id, marcus.id, marcus, {
      content: 'Thanks! I appreciate the support 🙏',
      isRead: true,
    }),
  ];
  marcusMessages.forEach((msg) => dbMessages.create(msg));

  // ========================================================================
  // NOTIFICATIONS
  // ========================================================================

  // Notifications for Sophia
  dbNotifications.create(
    createNotification(sophia.id, {
      type: 'new_subscriber',
      title: 'New Subscriber',
      message: 'Emma Rodriguez just subscribed to your Icon tier!',
      isRead: false,
    })
  );

  dbNotifications.create(
    createNotification(sophia.id, {
      type: 'new_tip',
      title: 'New Tip',
      message: 'You received a $50 tip from Emma Rodriguez!',
      isRead: false,
    })
  );

  dbNotifications.create(
    createNotification(sophia.id, {
      type: 'new_comment',
      title: 'New Comment',
      message: 'Emma Rodriguez commented on your post',
      isRead: true,
    })
  );

  dbNotifications.create(
    createNotification(sophia.id, {
      type: 'new_message',
      title: 'New Message',
      message: 'You have a new message from Emma Rodriguez',
      isRead: false,
    })
  );

  // Notifications for Emma
  dbNotifications.create(
    createNotification(emma.id, {
      type: 'new_message',
      title: 'New Message',
      message: 'Sophia Laurent replied to your message',
      isRead: true,
    })
  );

  // ========================================================================
  // ANALYTICS
  // ========================================================================

  // Analytics for Sophia
  dbAnalytics.set(sophia.id, createCreatorAnalytics(sophia.id, 'month'));

  // Analytics for Marcus
  dbAnalytics.set(marcus.id, createCreatorAnalytics(marcus.id, 'month'));

  console.log('[Mock DB] Database seeded successfully!');
  console.log(`[Mock DB] Users: ${dbUsers.getAll().length}`);
  console.log(`[Mock DB] Posts: ${dbPosts.getAll().length}`);
  console.log(`[Mock DB] Subscriptions: ${allFans.length} active`);
  console.log(`[Mock DB] Conversations: ${dbConversations.getByUser(emma.id).length}`);
};

// ============================================================================
// DEMO USER CREDENTIALS
// ============================================================================

export const DEMO_CREDENTIALS = {
  SOPHIA: {
    email: 'sophia@cabana.demo',
    password: 'demo123',
    persona: DEMO_PERSONAS.CREATOR_SOPHIA,
  },
  MARCUS: {
    email: 'marcus@cabana.demo',
    password: 'demo123',
    persona: DEMO_PERSONAS.CREATOR_MARCUS,
  },
  EMMA: {
    email: 'emma@cabana.demo',
    password: 'demo123',
    persona: DEMO_PERSONAS.FAN_EMMA,
  },
  ALEX: {
    email: 'alex@cabana.demo',
    password: 'demo123',
    persona: DEMO_PERSONAS.ADMIN_ALEX,
  },
};

// Initialize database on module load
seedDatabase();
