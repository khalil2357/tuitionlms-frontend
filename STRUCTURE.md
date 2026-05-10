# Frontend Project Structure

## Directory Overview

```
tuitionlms-frontend/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout wrapper
│   ├── page.tsx                  # Home page
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/                # User dashboard
│   │   └── page.tsx
│   ├── courses/                  # Course pages
│   │   ├── page.tsx              # All courses
│   │   └── [id]/page.tsx         # Individual course details
│   └── admin/                    # Admin panel
│       └── page.tsx
│
├── components/                   # Reusable React components
│   ├── auth/                     # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── courses/                  # Course components
│   │   └── CourseCard.tsx
│   ├── dashboard/                # Dashboard components
│   │   ├── StudentDashboard.tsx
│   │   └── InstructorDashboard.tsx
│   ├── admin/                    # Admin components
│   │   └── AdminPanel.tsx
│   └── shared/                   # Shared components
│       ├── Navbar.tsx
│       └── Sidebar.tsx
│
├── pages/                        # Legacy Pages Router (optional)
│
├── api/                          # Backend proxy routes
│   ├── auth/                     # Auth API routes
│   │   └── route.ts
│   ├── courses/                  # Courses API routes
│   │   └── route.ts
│   ├── admin/                    # Admin API routes
│   └── users/                    # Users API routes
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Auth hook
│   └── useCourses.ts             # Courses hook
│
├── lib/                          # Utility libraries
│   ├── api/
│   │   └── client.ts             # Axios API client configuration
│   └── auth/
│       └── auth-utils.ts         # Auth utilities
│
├── store/                        # Zustand state management
│   └── auth-store.ts             # Auth store
│
├── context/                      # React context providers
│   └── AuthContext.tsx           # Auth context
│
├── types/                        # TypeScript type definitions
│   ├── index.ts                  # Main types export
│   ├── user.ts                   # User types
│   ├── course.ts                 # Course types
│   └── auth.ts                   # Auth types
│
├── utils/                        # Helper functions
│   ├── helpers.ts                # General helpers
│   └── constants.ts              # App constants
│
├── styles/                       # Global styles
│   └── globals.css               # Tailwind CSS imports
│
├── public/                       # Static assets
│   └── [images, icons, etc.]
│
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.js             # PostCSS config
├── .gitignore                    # Git ignore rules
├── .env.example                  # Environment variables template
└── README.md                     # Project documentation
```

## Module Breakdown

### Authentication (`/app/auth/`, `/components/auth/`)
- Login page and form
- Registration page and form
- Password reset (if needed)

### Dashboard (`/app/dashboard/`, `/components/dashboard/`)
- Student dashboard
- Instructor dashboard
- Admin dashboard (separate at `/admin`)

### Courses (`/app/courses/`, `/components/courses/`)
- Course listing page
- Course details page
- Course creation/editing
- Lesson management
- Quiz management

### Admin (`/app/admin/`, `/components/admin/`)
- User management
- Instructor approvals
- System analytics
- Content moderation

### API Routes (`/api/`)
Backend proxy routes that call the NestJS backend:
- `/api/auth/*` - Authentication endpoints
- `/api/courses/*` - Course endpoints
- `/api/admin/*` - Admin endpoints
- `/api/users/*` - User endpoints

### State Management (`/store/`, `/context/`)
- Zustand stores for global state
- React context for providers
- Custom hooks for data fetching

### Types (`/types/`)
- User type definitions
- Course types
- Auth types
- Enrollment types
- Quiz types
- etc.

### Utilities (`/utils/`, `/lib/`)
- API client configuration
- Authentication helpers
- Form validation
- Date formatting
- Constants and enums

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout and metadata |
| `app/page.tsx` | Landing/home page |
| `next.config.js` | Next.js configuration |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.js` | Tailwind CSS theming |
| `lib/api/client.ts` | Axios instance for API calls |
| `store/auth-store.ts` | Global auth state |

## Styling

- **Framework:** Tailwind CSS
- **Global CSS:** `styles/globals.css`
- **Component Styles:** Inline Tailwind classes or CSS modules

## State Management

- **Global State:** Zustand (`store/`)
- **Context API:** For providers and auth (`context/`)
- **Local State:** React hooks within components

## API Integration

All API calls go through:
1. `lib/api/client.ts` - Axios instance with interceptors
2. API routes in `/api/` - Proxy to NestJS backend
3. Components use custom hooks for data fetching
4. Zustand stores persist auth state

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_API_URL` - Backend API base URL

## Development Workflow

1. Create components in `/components/`
2. Define types in `/types/`
3. Create pages in `/app/`
4. Use custom hooks from `/hooks/` for data
5. Manage state with Zustand in `/store/`
6. Proxy API calls through `/api/` routes
