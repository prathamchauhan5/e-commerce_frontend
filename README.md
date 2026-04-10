# E-commerce Frontend

A React frontend for product listing, filtering, cart management, and user interaction — built with URL-driven state and modular global state management.

![React](https://img.shields.io/badge/React-blue?style=flat-square) ![Zustand](https://img.shields.io/badge/Zustand-green?style=flat-square) ![URL--driven state](https://img.shields.io/badge/URL--driven%20state-grey?style=flat-square) ![Client-side filtering](https://img.shields.io/badge/Client--side%20filtering-orange?style=flat-square)

---

## Features

### Product Listing
- Category and search-based listing
- Pagination via `skip` / `limit`
- Sorting by price and rating
- URL-synced filters and state

### Filtering
- Price range (min / max)
- Rating-based filters
- Filter state lives in URL
- Clear filters in one click

### Product Detail Page
- Full product info display
- Quantity selection
- "You may also like" section
- State reset on product change

### Cart System
- Add to cart with loading state
- Cart drawer and dedicated page
- Quantity update and removal
- Per-item loading handling

### Coupon System
- Dropdown coupon selection
- Discount applied on cart total
- Separate product vs coupon discount
- Persisted coupon state

### Wishlist
- Add / remove from wishlist
- Persisted via Zustand + localStorage
- Toggle from product card

### Activity Tracking
- Tracks recent searches
- Tracks viewed products
- Tracks visited categories
- Stored locally for personalization

### SEO
- Dynamic page title per route
- Meta description updated per context
- Reflects category, search, and PDP
- Improves shareability and clarity

---

## Technical Decisions

### State Management
Zustand over React Context — avoids prop drilling, keeps the store modular, and enables persistence for cart, wishlist, and activity with minimal configuration.

### URL as Source of Truth
Filters, sorting, and pagination live in URL parameters — enabling shareable links, easier debugging, and predictable state across page loads.

### Client-side Filtering
Filtering runs on the client given the small dataset size — reducing API dependency and improving responsiveness without a network round-trip.

### Component Design
Reusable components with clear separation between UI and logic. Custom hooks handle data fetching and derived state.

---

## Future Scope

**Product variants** — Support for size and color variants with variant-specific pricing, availability, and selection on PDP and in cart.

**Cart enhancements** — Variant-aware cart items, cleaner per-variant pricing breakdown, and inventory validation at checkout.

**UI / UX improvements** — Image sliders on PDP, sidebar-based filter panel, improved media handling, and more refined micro-interactions.

**Performance** — Debounced search, memoization for large datasets, and lazy loading optimizations for images and routes.

---

## Setup

```bash
# install dependencies
npm install

# start dev server
npm run dev
```

---

**Author:** Pratham Chauhan
