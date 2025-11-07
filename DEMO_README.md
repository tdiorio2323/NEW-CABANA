# Cabana Demo Mode - Complete Documentation

## Overview

This is a **fully self-contained, mock-driven front-end showcase** for the Cabana platform. It runs **100% on client-side mock data** with **zero backend dependencies**, making it perfect for:

- Live demos and presentations
- Screen recordings
- Onboarding creators
- Testing UI/UX flows
- Development without backend

---

## Architecture

### Mock Data Layer

#### Components

1. **Type Definitions** (`src/types/index.ts`)
   - Complete TypeScript interfaces matching production API shapes
   - Prevents type drift between mock and real implementations

2. **In-Memory Database** (`src/lib/mock/database.ts`)
   - Full CRUD operations for all entities
   - Indexed lookups for performance
   - Relationship management
   - Stateful persistence during session

3. **Data Factories** (`src/lib/mock/factories.ts`)
   - Faker.js-powered realistic data generation
   - Seeded randomness for deterministic output
   - Batch creation utilities
   - Configurable data volumes

4. **Fixtures** (`src/lib/mock/fixtures.ts`)
   - Pre-defined demo personas (Sophia, Marcus, Emma, Alex)
   - Curated sample data
   - Relationship graphs
   - Analytics data

5. **Mock API Adapter** (`src/lib/mock/api.ts`)
   - Network delay simulation (300-1000ms)
   - Configurable error injection
   - Identical interface to production API
   - Response pagination
   - Loading states

#### Design Rationale

**Why in-memory over MSW?**
- Simpler setup (no service worker)
- Faster performance
- Easier state inspection and manipulation
- No CORS issues
- Better for demo controls

**Tradeoffs:**
- Data resets on page refresh (by design for demos)
- No request interception logs
- Cannot test actual fetch calls

---

## Quick Start

### Prerequisites

```bash
Node.js 18+ and npm
```

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd NEW-CABANA

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

---

## Demo Personas

### Pre-Configured Accounts

All demo accounts use password: **`demo123`**

#### 1. Sophia Laurent (Creator - Icon Tier)
- **Email:** `sophia@cabana.demo`
- **Username:** `@sophia_luxury`
- **Stats:** 2,547 subscribers, $45,320 earnings
- **Use Case:** Established luxury creator with high engagement

#### 2. Marcus Chen (Creator - Creator Tier)
- **Email:** `marcus@cabana.demo`
- **Username:** `@marcus_nights`
- **Stats:** 892 subscribers, $12,450 earnings
- **Use Case:** Rising photographer and event host

#### 3. Emma Rodriguez (Fan)
- **Email:** `emma@cabana.demo`
- **Username:** `@emma_vip`
- **Stats:** Following 12 creators
- **Use Case:** Active subscriber and content consumer

#### 4. Alex Kim (Admin)
- **Email:** `alex@cabana.demo`
- **Username:** `@admin_alex`
- **Use Case:** Platform administrator

---

## Demo Control Panel

### Accessing the Panel

Click the **🎮 Demo Controls** button (bottom-right corner) to open the control panel.

### Features

#### 1. Persona Switching
- **Purpose:** Instantly switch between user roles
- **How:** Click any persona card
- **Effect:** Logs in as that user immediately

#### 2. Data Reset
- **Purpose:** Reset all mock data to initial state
- **Seed Control:** Change the random seed for different datasets
- **Use Cases:**
  - Start fresh for new demo
  - Generate different sample data
  - Test with varied scenarios

#### 3. Network Simulation
- **Delay Toggle:** Enable/disable artificial network latency
- **Delay Slider:** Adjust delay from 0-3000ms
- **Use Case:** Demonstrate loading states and skeleton screens

#### 4. Error Injection
- **Error Toggle:** Enable random API failures
- **Error Rate:** Set failure probability (0-100%)
- **Use Cases:**
  - Test error boundaries
  - Show error handling UI
  - Demonstrate resilience

---

## Feature Coverage

### ✅ Implemented Flows

#### Authentication
- [x] Login with email/password
- [x] Quick demo persona login
- [x] Signup with role selection
- [x] Session persistence
- [x] Logout

#### Creator Dashboard
- [x] Revenue analytics
- [x] Subscriber metrics
- [x] Engagement stats
- [x] Transaction history
- [x] Time-series charts

#### Content Feed
- [x] Paginated post feed
- [x] Like/unlike posts
- [x] Comment counts
- [x] Media display (images/videos)
- [x] Visibility badges (public/subscriber/icon-only)

#### Creator Posts
- [x] View all creator posts
- [x] Delete posts
- [x] Post statistics

#### Messaging
- [x] Conversation list
- [x] Unread counts
- [x] Participant avatars
- [x] Last message preview

#### Profile
- [x] User information display
- [x] Stats dashboard
- [x] Avatar and bio
- [x] Tier display

### 🚧 Simplified/Placeholder

- [ ] Post creation form (create button present, form not built)
- [ ] Comment creation (button present, modal not built)
- [ ] Tipping modal (button present, flow not built)
- [ ] Message send/receive UI (conversation detail not built)
- [ ] Profile editing (edit button present, form not built)
- [ ] Subscription management (backend logic complete, UI minimal)

### Rationale for Simplification

The focus was on demonstrating **data flow**, **mock architecture**, and **key UX patterns**. Missing pieces are straightforward forms that follow established patterns.

---

## Routing Structure

```
/                   → Landing page (marketing site)
/login              → Login page with demo personas
/signup             → Registration form

Protected Routes (requires auth):
/feed               → Main content feed (all users)
/dashboard          → Creator analytics (creators only)
/posts              → Creator's posts (creators only)
/messages           → Conversations (all users)
/profile            → User profile (all users)
```

---

## Mock API Endpoints

All endpoints return `ApiResponse<T>` or `PaginatedResponse<T>`:

### Authentication
- `POST /auth/login` → Login with credentials
- `POST /auth/signup` → Create new account
- `GET /auth/me` → Get current user
- `POST /auth/logout` → End session

### Users
- `GET /users/:id` → Get user profile
- `PATCH /users/:id` → Update profile
- `GET /users/creators` → List all creators

### Posts
- `GET /posts/feed/:userId` → Get user feed
- `GET /posts/:id` → Get single post
- `GET /posts/creator/:creatorId` → Get creator's posts
- `POST /posts` → Create new post
- `DELETE /posts/:id` → Delete post
- `POST /posts/:id/like` → Toggle like

### Comments
- `GET /posts/:id/comments` → Get post comments
- `POST /posts/:id/comments` → Add comment

### Subscriptions
- `GET /subscriptions/my/:userId` → Get user's subscriptions
- `GET /subscriptions/creator/:creatorId` → Get creator's subscribers
- `POST /subscriptions` → Subscribe to creator
- `DELETE /subscriptions/:id` → Cancel subscription

### Transactions
- `GET /transactions/:userId` → Get user transactions
- `POST /transactions/tip` → Send tip

### Messaging
- `GET /conversations/:userId` → Get user conversations
- `GET /conversations/:id/messages` → Get messages
- `POST /messages` → Send message

### Notifications
- `GET /notifications/:userId` → Get notifications
- `PATCH /notifications/:id/read` → Mark as read

### Analytics
- `GET /analytics/:creatorId` → Get creator analytics

---

## State Management

### Zustand Stores

#### Auth Store (`src/lib/store/authStore.ts`)
```typescript
{
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login(credentials)
  signup(data)
  logout()
  updateUser(updates)
}
```

**Persistence:** localStorage via Zustand persist middleware

#### Demo Store (`src/lib/store/demoStore.ts`)
```typescript
{
  currentPersona: string | null
  enableNetworkDelay: boolean
  networkDelayMs: number
  enableRandomErrors: boolean
  errorRate: number
  seed: number

  switchPersona(id)
  resetData(seed?)
  toggleNetworkDelay()
  toggleRandomErrors()
}
```

---

## Testing Checklist

### Before Demo

- [ ] Clear browser cache and localStorage
- [ ] Open demo panel and verify seed is set
- [ ] Test network delay is reasonable (500ms default)
- [ ] Disable error injection
- [ ] Have 2-3 browser tabs ready for multi-user demo

### Core Flows to Test

1. **Landing → Login**
   - [ ] Click "Early Access Login" button
   - [ ] Click demo persona (e.g., Sophia)
   - [ ] Verify redirect to /feed

2. **Creator Dashboard**
   - [ ] Navigate to Dashboard
   - [ ] Verify revenue displays
   - [ ] Check subscriber count
   - [ ] Scroll through transactions

3. **Content Feed**
   - [ ] View posts in feed
   - [ ] Like a post (heart fills)
   - [ ] Unlike a post (heart empties)
   - [ ] Verify subscriber-only badge

4. **Persona Switching**
   - [ ] Open demo panel
   - [ ] Switch to Emma (fan)
   - [ ] Verify different feed content
   - [ ] Switch back to Sophia

5. **Data Reset**
   - [ ] Open demo panel
   - [ ] Change seed to 999
   - [ ] Click "Reset Database"
   - [ ] Verify new data loads

---

## Responsive Design

### Breakpoints

- **Mobile:** < 640px
  - Bottom navigation bar
  - Single column layout
  - Stacked cards

- **Tablet:** 640px - 1024px
  - Hybrid navigation
  - 2-column grids
  - Larger touch targets

- **Desktop:** > 1024px
  - Top navigation bar
  - Multi-column layouts
  - Hover states

### Testing

```bash
# Use browser DevTools device emulation
# Recommended test devices:
- iPhone 14 Pro (390x844)
- iPad Pro (1024x1366)
- Desktop 1920x1080
```

---

## Accessibility

### Implemented Features

- [x] Semantic HTML5 elements
- [x] ARIA labels on interactive elements
- [x] Keyboard navigation support
- [x] Focus visible states
- [x] Alt text on images
- [x] Color contrast compliance (WCAG AA)
- [x] Screen reader friendly structure

### Testing

```bash
# Manual keyboard navigation test:
Tab       → Move focus forward
Shift+Tab → Move focus backward
Enter     → Activate buttons/links
Esc       → Close modals
```

---

## Troubleshooting

### Issue: Data not loading

**Solution:**
1. Open browser console
2. Look for API errors
3. Open demo panel → Reset Database
4. Refresh page

### Issue: "User not found" after login

**Solution:**
- The database resets on page refresh
- Use the demo panel persona switcher instead of manual login
- Or reset database after refresh

### Issue: Images not loading

**Solution:**
- External images (Faker.js URLs) require internet
- Some Lorem Flickr images may be rate-limited
- This is expected in demo mode

### Issue: Routing not working

**Solution:**
- Ensure you're using `npm run dev` (Vite dev server)
- Check browser console for import errors
- Verify all files in `src/` directory

---

## Performance

### Metrics

- **Initial Load:** < 2s
- **Time to Interactive:** < 3s
- **Mock API Response:** 300-1000ms (configurable)
- **Bundle Size:** ~500KB (uncompressed)

### Optimization

- Code splitting via React Router
- Lazy loading for large components
- Image lazy loading
- Memoization in list renders

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Not Supported:**
- Internet Explorer (end of life)

---

## Deployment

### Static Hosting

```bash
# Build for production
npm run build

# Output: dist/ directory
# Deploy to: Vercel, Netlify, CloudFlare Pages, AWS S3, etc.
```

### Environment Variables

**None required!** All mock data is client-side.

**Optional (for AI image generation):**
```env
VITE_GEMINI_API_KEY=your-key-here
```

---

## Extending the Demo

### Adding New Personas

1. Edit `src/lib/mock/fixtures.ts`
2. Add to `DEMO_PERSONAS` object
3. Create user in `createSeededUsers()`
4. Add credentials to `DEMO_CREDENTIALS`

### Adding New Mock Data

1. Define types in `src/types/index.ts`
2. Add database methods in `src/lib/mock/database.ts`
3. Create factory in `src/lib/mock/factories.ts`
4. Seed in `fixtures.ts`
5. Create API endpoint in `src/lib/mock/api.ts`

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/AppRouter.tsx`
3. Add navigation link in `AppLayout.tsx`
4. Update presenter script

---

## Known Limitations

1. **Data Persistence:** Resets on refresh (by design)
2. **Real-time:** No WebSocket simulation
3. **File Upload:** Uses `URL.createObjectURL` (temporary)
4. **Search:** Not implemented
5. **Infinite Scroll:** Pagination only
6. **Push Notifications:** Not simulated

---

## Support & Contact

For issues, questions, or feature requests:
- Check console logs
- Review this documentation
- Examine mock data in `src/lib/mock/`

---

## License

[Add your license here]

---

**Built with:** React 19, TypeScript, Vite, Zustand, React Router, TailwindCSS, Faker.js
