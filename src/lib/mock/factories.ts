/**
 * Data Factories with Faker.js
 * Generates realistic mock data with seeded randomness
 */

import { faker } from '@faker-js/faker';
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
  UserRole,
  SubscriptionTier,
  PostVisibility,
  MediaType,
  Media,
} from '../../types';

// ============================================================================
// SEED MANAGEMENT
// ============================================================================

let currentSeed = 42; // Default seed for deterministic data

export const setSeed = (seed: number) => {
  currentSeed = seed;
  faker.seed(seed);
};

export const getSeed = () => currentSeed;

// Initialize with default seed
setSeed(currentSeed);

// ============================================================================
// HELPER UTILITIES
// ============================================================================

const generateId = () => faker.string.uuid();

const randomFromArray = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const randomBoolean = (probability = 0.5): boolean => {
  return Math.random() < probability;
};

// ============================================================================
// MEDIA FACTORIES
// ============================================================================

export const createMedia = (type: MediaType = 'image'): Media => {
  const id = generateId();

  if (type === 'image') {
    const width = faker.number.int({ min: 800, max: 1920 });
    const height = faker.number.int({ min: 600, max: 1080 });
    return {
      id,
      type: 'image',
      url: faker.image.urlLoremFlickr({ width, height, category: 'nightlife,party,luxury' }),
      thumbnail: faker.image.urlLoremFlickr({ width: 400, height: 300, category: 'nightlife' }),
      width,
      height,
    };
  }

  if (type === 'video') {
    return {
      id,
      type: 'video',
      url: `https://sample-videos.com/video123/mp4/720/${faker.string.alphanumeric(8)}.mp4`,
      thumbnail: faker.image.urlLoremFlickr({ width: 1280, height: 720, category: 'nightlife' }),
      duration: faker.number.int({ min: 10, max: 300 }),
      width: 1280,
      height: 720,
    };
  }

  return {
    id,
    type: 'audio',
    url: `https://sample-audio.com/audio/${faker.string.alphanumeric(8)}.mp3`,
    duration: faker.number.int({ min: 30, max: 600 }),
  };
};

// ============================================================================
// USER FACTORY
// ============================================================================

export const createUser = (overrides?: Partial<User>): User => {
  const role: UserRole = overrides?.role || randomFromArray(['creator', 'fan', 'admin']);
  const isCreator = role === 'creator';
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.username({ firstName, lastName }).toLowerCase();

  const tierOptions: SubscriptionTier[] = ['free', 'creator', 'icon'];
  const tier = randomFromArray(tierOptions);

  const user: User = {
    id: generateId(),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    username,
    displayName: `${firstName} ${lastName}`,
    avatar: faker.image.avatarGitHub(),
    bio: faker.lorem.sentence({ min: 5, max: 15 }),
    role,
    subscriptionTier: tier,
    isVerified: randomBoolean(0.3),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    ...overrides,
  };

  if (isCreator) {
    user.isCreator = true;
    user.subscriberCount = faker.number.int({ min: 10, max: 50000 });
    user.totalEarnings = faker.number.float({ min: 100, max: 500000, fractionDigits: 2 });
  } else {
    user.followingCount = faker.number.int({ min: 0, max: 200 });
    user.subscriptions = [];
  }

  return user;
};

// ============================================================================
// POST FACTORY
// ============================================================================

export const createPost = (creatorId: string, creator: User, overrides?: Partial<Post>): Post => {
  const visibilityOptions: PostVisibility[] = ['public', 'subscribers', 'icon-only'];
  const visibility = randomFromArray(visibilityOptions);

  const hasMedia = randomBoolean(0.7);
  const mediaCount = hasMedia ? faker.number.int({ min: 1, max: 4 }) : 0;
  const media: Media[] = [];

  for (let i = 0; i < mediaCount; i++) {
    const mediaType = randomFromArray<MediaType>(['image', 'image', 'image', 'video']); // Favor images
    media.push(createMedia(mediaType));
  }

  return {
    id: generateId(),
    creatorId,
    creator,
    content: faker.lorem.paragraph({ min: 1, max: 3 }),
    media,
    visibility,
    likeCount: faker.number.int({ min: 0, max: 10000 }),
    commentCount: faker.number.int({ min: 0, max: 500 }),
    isLiked: randomBoolean(0.2),
    isPinned: randomBoolean(0.05),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    ...overrides,
  };
};

// ============================================================================
// COMMENT FACTORY
// ============================================================================

export const createComment = (
  postId: string,
  userId: string,
  user: User,
  overrides?: Partial<Comment>
): Comment => {
  return {
    id: generateId(),
    postId,
    userId,
    user,
    content: faker.lorem.sentence({ min: 3, max: 12 }),
    likeCount: faker.number.int({ min: 0, max: 500 }),
    isLiked: randomBoolean(0.15),
    createdAt: faker.date.recent({ days: 7 }).toISOString(),
    ...overrides,
  };
};

// ============================================================================
// TRANSACTION FACTORY
// ============================================================================

export const createTransaction = (
  fromUserId: string,
  toUserId: string,
  overrides?: Partial<Transaction>
): Transaction => {
  const type = randomFromArray(['subscription', 'tip', 'payout'] as const);
  const status = randomFromArray(['completed', 'completed', 'completed', 'pending'] as const);

  let amount = 9.99;
  let description = 'Monthly subscription';

  if (type === 'tip') {
    amount = faker.number.float({ min: 5, max: 500, fractionDigits: 2 });
    description = `Tip from fan`;
  } else if (type === 'payout') {
    amount = faker.number.float({ min: 100, max: 5000, fractionDigits: 2 });
    description = 'Payout to bank account';
  }

  return {
    id: generateId(),
    type,
    amount,
    currency: 'USD',
    status,
    fromUserId,
    toUserId,
    description,
    createdAt: faker.date.recent({ days: 60 }).toISOString(),
    ...overrides,
  };
};

// ============================================================================
// SUBSCRIPTION FACTORY
// ============================================================================

export const createSubscription = (
  fanId: string,
  creatorId: string,
  fan: User,
  creator: User,
  overrides?: Partial<Subscription>
): Subscription => {
  const tier: SubscriptionTier = randomFromArray(['creator', 'icon']);
  const amount = tier === 'creator' ? 9.99 : 29.99;
  const status = randomFromArray(['active', 'active', 'active', 'cancelled'] as const);

  const startDate = faker.date.past({ years: 1 }).toISOString();
  const endDate =
    status === 'cancelled' ? faker.date.future({ years: 0.5 }).toISOString() : undefined;

  return {
    id: generateId(),
    fanId,
    creatorId,
    fan,
    creator,
    tier,
    amount,
    status,
    startDate,
    endDate,
    autoRenew: status === 'active' ? randomBoolean(0.8) : false,
    ...overrides,
  };
};

// ============================================================================
// MESSAGE & CONVERSATION FACTORIES
// ============================================================================

export const createMessage = (
  conversationId: string,
  senderId: string,
  sender: User,
  overrides?: Partial<Message>
): Message => {
  const hasMedia = randomBoolean(0.15);
  const media = hasMedia ? [createMedia('image')] : undefined;

  return {
    id: generateId(),
    conversationId,
    senderId,
    sender,
    content: faker.lorem.sentence({ min: 3, max: 20 }),
    media,
    isRead: randomBoolean(0.6),
    createdAt: faker.date.recent({ days: 7 }).toISOString(),
    ...overrides,
  };
};

export const createConversation = (
  participants: User[],
  overrides?: Partial<Conversation>
): Conversation => {
  const id = generateId();

  // Create a sample last message
  const lastMessageSender = randomFromArray(participants);
  const lastMessage = createMessage(id, lastMessageSender.id, lastMessageSender);

  return {
    id,
    participants,
    lastMessage,
    unreadCount: faker.number.int({ min: 0, max: 10 }),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent({ days: 7 }).toISOString(),
    ...overrides,
  };
};

// ============================================================================
// NOTIFICATION FACTORY
// ============================================================================

export const createNotification = (userId: string, overrides?: Partial<Notification>): Notification => {
  const type = randomFromArray([
    'new_subscriber',
    'new_tip',
    'new_comment',
    'new_like',
    'new_message',
  ] as const);

  const messages = {
    new_subscriber: 'You have a new subscriber!',
    new_tip: 'You received a tip!',
    new_comment: 'Someone commented on your post',
    new_like: 'Someone liked your post',
    new_message: 'You have a new message',
  };

  return {
    id: generateId(),
    userId,
    type,
    title: type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    message: messages[type],
    isRead: randomBoolean(0.4),
    createdAt: faker.date.recent({ days: 14 }).toISOString(),
    ...overrides,
  };
};

// ============================================================================
// ANALYTICS FACTORY
// ============================================================================

export const createCreatorAnalytics = (
  userId: string,
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): CreatorAnalytics => {
  const totalRevenue = faker.number.float({ min: 1000, max: 100000, fractionDigits: 2 });
  const subscriptionRevenue = totalRevenue * 0.7;
  const tipRevenue = totalRevenue * 0.3;

  const totalSubscribers = faker.number.int({ min: 50, max: 10000 });
  const newSubscribers = faker.number.int({ min: 5, max: 500 });

  const revenueByDay = [];
  const subscribersByDay = [];
  const viewsByDay = [];

  const days = period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    revenueByDay.push({
      date: date.toISOString().split('T')[0],
      amount: faker.number.float({ min: 50, max: 5000, fractionDigits: 2 }),
    });

    subscribersByDay.push({
      date: date.toISOString().split('T')[0],
      count: faker.number.int({ min: 10, max: 1000 }),
    });

    viewsByDay.push({
      date: date.toISOString().split('T')[0],
      count: faker.number.int({ min: 100, max: 10000 }),
    });
  }

  return {
    userId,
    period,
    totalRevenue,
    subscriptionRevenue,
    tipRevenue,
    revenueChange: faker.number.float({ min: -20, max: 50, fractionDigits: 2 }),
    totalSubscribers,
    newSubscribers,
    subscriberChange: faker.number.float({ min: -10, max: 30, fractionDigits: 2 }),
    totalViews: faker.number.int({ min: 10000, max: 500000 }),
    totalLikes: faker.number.int({ min: 5000, max: 50000 }),
    totalComments: faker.number.int({ min: 500, max: 10000 }),
    engagementRate: faker.number.float({ min: 1, max: 15, fractionDigits: 2 }),
    totalPosts: faker.number.int({ min: 10, max: 500 }),
    postsThisPeriod: faker.number.int({ min: 1, max: 50 }),
    revenueByDay,
    subscribersByDay,
    viewsByDay,
  };
};

// ============================================================================
// BATCH FACTORIES
// ============================================================================

export const createUsers = (count: number, role?: UserRole): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push(createUser(role ? { role } : undefined));
  }
  return users;
};

export const createPosts = (count: number, creator: User): Post[] => {
  const posts: Post[] = [];
  for (let i = 0; i < count; i++) {
    posts.push(createPost(creator.id, creator));
  }
  return posts;
};

export const createComments = (count: number, postId: string, users: User[]): Comment[] => {
  const comments: Comment[] = [];
  for (let i = 0; i < count; i++) {
    const user = randomFromArray(users);
    comments.push(createComment(postId, user.id, user));
  }
  return comments;
};
