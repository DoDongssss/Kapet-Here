kapet-here/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── assets/
│       └── images/
│           └── placeholder-coffee.jpg
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   │
│   ├── assets/
│   │   ├── fonts/
│   │   └── images/
│   │       └── logo.svg
│   │
│   ├── components/
│   │   │
│   │   ├── ui/                          # shadcn/ui base components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx               # toast notifications
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx            # main app shell
│   │   │   ├── AdminLayout.tsx          # admin shell with sidebar
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx              # admin sidebar
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── map/
│   │   │   ├── MapView.tsx              # main Leaflet map container
│   │   │   ├── CoffeeShopMarker.tsx     # custom map marker
│   │   │   ├── UserLocationMarker.tsx   # blue dot for user location
│   │   │   ├── MapControls.tsx          # zoom, locate-me buttons
│   │   │   └── DirectionsLayer.tsx      # route line overlay
│   │   │
│   │   ├── coffee-shop/
│   │   │   ├── CoffeeShopCard.tsx       # card shown in sidebar/list
│   │   │   ├── CoffeeShopDrawer.tsx     # bottom drawer on mobile
│   │   │   ├── CoffeeShopDetail.tsx     # full detail panel/page
│   │   │   ├── CoffeeShopGallery.tsx    # photo carousel/grid
│   │   │   ├── CoffeeShopRating.tsx     # star display component
│   │   │   └── CoffeeShopList.tsx       # scrollable list of shops
│   │   │
│   │   ├── feedback/
│   │   │   ├── FeedbackForm.tsx         # guest feedback form (token-based)
│   │   │   ├── FeedbackTokenInput.tsx   # token entry field
│   │   │   ├── FeedbackPhotoUpload.tsx  # photo upload within feedback
│   │   │   ├── FeedbackList.tsx         # display list of feedback
│   │   │   ├── FeedbackCard.tsx         # single feedback item
│   │   │   └── StarRating.tsx           # interactive star input
│   │   │
│   │   ├── admin/
│   │   │   ├── CoffeeShopTable.tsx      # data table of all shops
│   │   │   ├── CoffeeShopForm.tsx       # add/edit shop form
│   │   │   ├── DeleteConfirmDialog.tsx  # confirm delete modal
│   │   │   ├── TokenGenerator.tsx       # generate feedback tokens UI
│   │   │   ├── TokenTable.tsx           # list of generated tokens
│   │   │   ├── PhotoManager.tsx         # manage shop photos
│   │   │   └── AdminStats.tsx           # simple dashboard stats
│   │   │
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── ImageUpload.tsx          # reusable image upload
│   │       ├── PageHeader.tsx
│   │       └── SearchBar.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx                 # map + shop list (main page)
│   │   ├── CoffeeShopPage.tsx           # individual shop detail page
│   │   ├── FeedbackPage.tsx             # guest feedback submission page
│   │   ├── NotFoundPage.tsx             # 404
│   │   │
│   │   └── admin/
│   │       ├── AdminLoginPage.tsx       # admin auth
│   │       ├── AdminDashboardPage.tsx   # overview/stats
│   │       ├── AdminShopsPage.tsx       # CRUD list of shops
│   │       ├── AdminShopEditPage.tsx    # add/edit shop form page
│   │       └── AdminTokensPage.tsx      # token management
│   │
│   ├── hooks/
│   │   ├── useCoffeeShops.ts            # fetch all shops
│   │   ├── useCoffeeShop.ts             # fetch single shop by id
│   │   ├── useFeedback.ts               # fetch feedback for a shop
│   │   ├── useSubmitFeedback.ts         # submit feedback via RPC
│   │   ├── useGenerateToken.ts          # admin: generate token RPC
│   │   ├── useUserLocation.ts           # geolocation hook
│   │   ├── useDirections.ts             # OSRM/routing logic
│   │   ├── useAdminAuth.ts              # admin session state
│   │   └── useImageUpload.ts            # Supabase storage upload
│   │
│   ├── lib/
│   │   ├── supabase.ts                  # Supabase client init
│   │   ├── supabaseStorage.ts           # storage helper functions
│   │   └── utils.ts                     # cn() and other helpers
│   │
│   ├── services/
│   │   ├── coffeeShopService.ts         # DB queries for shops
│   │   ├── feedbackService.ts           # RPC calls for feedback
│   │   ├── tokenService.ts              # token generation/validation
│   │   ├── photoService.ts              # photo CRUD
│   │   └── authService.ts              # admin login/logout
│   │
│   ├── store/
│   │   ├── useMapStore.ts               # Zustand: selected shop, map state
│   │   ├── useUIStore.ts                # Zustand: drawer, modal open states
│   │   └── useAuthStore.ts              # Zustand: admin auth state
│   │
│   ├── types/
│   │   ├── coffeeShop.ts                # CoffeeShop, CoffeeShopPhoto types
│   │   ├── feedback.ts                  # Feedback, FeedbackToken types
│   │   ├── auth.ts                      # Admin auth types
│   │   └── supabase.ts                  # Generated DB types (from Supabase CLI)
│   │
│   ├── constants/
│   │   ├── map.ts                       # default center coords, zoom levels
│   │   └── routes.ts                    # route path constants
│   │
│   └── styles/
│       └── globals.css                  # Tailwind directives + custom CSS vars
│
├── .env
├── .env.example
├── .gitignore
├── components.json                      # shadcn/ui config
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts