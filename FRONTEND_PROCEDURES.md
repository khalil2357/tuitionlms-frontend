# Frontend Development Procedures - Complete Guide

## Phase 1: Project Setup & Initialization

### Step 1.1: Install Dependencies
- Run `npm install` in the frontend directory
- Verify all packages from `package.json` are installed
- Check that `node_modules` folder is created
- Confirm no peer dependency warnings

### Step 1.2: Environment Configuration
- Copy `.env.example` to `.env.local`
- Set `NEXT_PUBLIC_API_URL` to backend URL (`http://localhost:3000/api/v1`)
- Add any additional environment variables needed (API keys, etc.)
- Verify environment file is in `.gitignore` for security

### Step 1.3: Verify Next.js Setup
- Run `npm run dev` to start development server
- Confirm server runs on `http://localhost:3000`
- Check that Next.js compiles without errors
- Verify hot module replacement works

### Step 1.4: Verify TypeScript Configuration
- Check `tsconfig.json` is properly configured
- Verify path aliases work (`@/*` mappings)
- Confirm strict mode is enabled for type safety
- Test that import statements work with aliases

---

## Phase 2: Core Infrastructure Setup

### Step 2.1: Configure API Client
**Location:** `lib/api/client.ts`

- Import Axios library
- Create Axios instance with base URL from environment variable
- Set default headers (Content-Type, Accept)
- Configure request interceptor to add JWT token from localStorage
- Configure response interceptor for error handling
- Handle 401 (Unauthorized) responses by clearing token and redirecting to login
- Handle network errors gracefully
- Export configured instance for use throughout app

### Step 2.2: Setup Authentication Store
**Location:** `store/auth-store.ts`

- Import Zustand library
- Create store with initial state:
  - `user` object (null by default)
  - `token` string (null by default)
  - `isLoading` boolean
  - `error` message
  - `isAuthenticated` boolean
- Add store actions:
  - `setUser()` - Update user state
  - `setToken()` - Save token
  - `setLoading()` - Update loading state
  - `setError()` - Update error message
  - `login()` - Handle login process
  - `register()` - Handle registration
  - `logout()` - Clear auth state
  - `loadFromStorage()` - Restore auth from localStorage on app load
- Implement localStorage persistence for token and user

### Step 2.3: Create Authentication Context
**Location:** `context/AuthContext.tsx`

- Create React Context for auth provider
- Create context value type with:
  - `user` from store
  - `token` from store
  - `isAuthenticated` computed value
  - `login()` function
  - `register()` function
  - `logout()` function
  - `isLoading` state
  - `error` message
- Create Provider component wrapper
- Use Zustand store inside provider
- Load auth from localStorage on mount
- Export context and provider for app-wide use

### Step 2.4: Setup Type Definitions
**Location:** `types/` directory

- Define `User` type with fields:
  - `id`, `name`, `email`, `role`, `university`, `educationLevel`, `avatar`, `phone`, `bio`, `headline`, `isActive`, `isVerified`, `createdAt`, `updatedAt`
- Define `Course` type with fields:
  - `id`, `title`, `description`, `categoryId`, `instructorId`, `price`, `originalPrice`, `level`, `status`, `totalEnrollments`, `averageRating`, `createdAt`, `updatedAt`
- Define `Enrollment` type:
  - `id`, `userId`, `courseId`, `enrolledAt`, `completedAt`, `status`
- Define `Quiz` type:
  - `id`, `courseId`, `title`, `description`, `passingScore`, `timeLimit`
- Define `LoginRequest` and `LoginResponse` for API
- Define `RegisterRequest` and `RegisterResponse` for API
- Create discriminated union types for different user roles (Student, Instructor, Admin)

### Step 2.5: Create Utility Functions
**Location:** `lib/auth/auth-utils.ts` and `utils/helpers.ts`

Authentication utilities:
- Function to save token to localStorage
- Function to retrieve token from localStorage
- Function to clear token from localStorage
- Function to check if token is expired
- Function to decode JWT token (if needed for client-side verification)

General utilities:
- Function to format dates
- Function to format currency
- Function to truncate text
- Function to validate email format
- Function to calculate course progress percentage
- Function to format time duration

### Step 2.6: Create Constants
**Location:** `utils/constants.ts`

- API endpoint paths (auth, courses, admin, etc.)
- User role constants (STUDENT, INSTRUCTOR, ADMIN)
- Course status constants (DRAFT, PUBLISHED, ARCHIVED)
- Enrollment status constants (ACTIVE, COMPLETED, DROPPED)
- Error messages for common scenarios
- Success messages for operations
- Form validation rules (min length, max length, etc.)
- Pagination defaults (items per page, max pages)

---

## Phase 3: Authentication Implementation

### Step 3.1: Create Login Form Component
**Location:** `components/auth/LoginForm.tsx`

Component features:
- Form with email input field
- Form with password input field
- Form validation before submission
- Submit button with loading state
- Display error messages if login fails
- Remember me checkbox (optional)
- Link to registration page
- Link to forgot password (if applicable)
- Handle form submission with API call
- Store JWT token and user in auth store
- Redirect to dashboard on successful login
- Show loading spinner during API request
- Clear form on successful submission

### Step 3.2: Create Registration Form Component
**Location:** `components/auth/RegisterForm.tsx`

Component features:
- Form fields: name, email, password, confirm password
- Field: university selection (optional)
- Field: education level (optional)
- Form validation:
  - Email format validation
  - Password strength validation (min 8 chars, etc.)
  - Password match confirmation
  - Required field validation
- Show validation errors in real-time
- Submit button with loading state
- Display API errors clearly
- Link to login page
- Handle form submission with API call
- Store user and token on success
- Redirect to dashboard on success
- Show success message or notification
- Clear form after submission

### Step 3.3: Create Instructor Registration Component
**Location:** `components/auth/InstructorRegisterForm.tsx` (new)

Component features:
- All fields from student registration
- Additional fields: expertise (text area), bio (text area), phone number
- Specializations/skills multi-select
- Years of experience selector
- Educational background (optional)
- Professional certifications (optional)
- Form validation for all fields
- Submit button with loading state
- Display success message: "Your application is pending admin approval"
- Link back to login
- Handle API call for instructor registration endpoint
- Redirect to login with message

### Step 3.4: Create Login Page
**Location:** `app/auth/login/page.tsx`

Page structure:
- Navigation/header with logo
- Left side: Branding and welcome message (optional)
- Right side: LoginForm component
- Social login options (if applicable)
- "Don't have an account?" link to register
- Responsive layout for mobile
- Meta tags and SEO

### Step 3.5: Create Registration Page
**Location:** `app/auth/register/page.tsx`

Page structure:
- Navigation/header with logo
- RegisterForm component centered
- Tab or toggle for Student/Instructor registration
- "Already have an account?" link to login
- Terms of service checkbox
- Privacy policy link
- Responsive layout
- Meta tags for SEO

### Step 3.6: Create useAuth Custom Hook
**Location:** `hooks/useAuth.ts`

Hook functionality:
- Export auth store functions
- Provide auth state from store
- Handle login function that:
  - Calls API with email and password
  - Stores token in auth store
  - Stores user data in auth store
  - Saves to localStorage
  - Returns success/error
- Provide register function that:
  - Calls API with registration data
  - Automatically logs in after success (optional)
  - Returns success/error
- Provide logout function that:
  - Clears auth store
  - Clears localStorage
  - Redirects to login page
- Export isAuthenticated boolean
- Export user object
- Export loading and error states
- Export token string

---

## Phase 4: Shared Components & Layout

### Step 4.1: Create Navbar Component
**Location:** `components/shared/Navbar.tsx`

Features:
- App logo/branding on left
- Navigation links based on user role:
  - Student: Dashboard, Courses, My Courses, My Enrollments
  - Instructor: Dashboard, My Courses, Create Course, Students, Analytics
  - Admin: Dashboard, Users, Courses, Approvals, Analytics
- User profile dropdown menu with:
  - User name and avatar
  - Profile link
  - Settings link
  - Logout button
- Search bar (optional, for courses)
- Notifications icon with badge (optional)
- Mobile hamburger menu
- Active route indicator
- Responsive design
- Use auth hook to check user role and display appropriate items
- Conditionally show logout button based on authentication
- Handle logout with confirmation

### Step 4.2: Create Sidebar Component
**Location:** `components/shared/Sidebar.tsx`

Features:
- Collapsible sidebar for desktop
- Role-based menu items:
  - Dashboard link
  - My profile link
  - Settings link
  - Role-specific sections (courses, admin, etc.)
- Icons for each menu item
- Active route highlighting
- Collapse/expand toggle
- Mobile drawer that overlays
- Fade on mobile when closed
- Smooth animations
- Links styled as buttons
- Small indicator for notifications (optional)
- Logout button at bottom
- Theme toggle (light/dark) optional

### Step 4.3: Create Root Layout
**Location:** `app/layout.tsx`

Layout structure:
- Metadata (title, description, favicon, etc.)
- Import global CSS and Tailwind
- Setup AuthContext Provider wrapper
- Setup any other providers (theme, etc.)
- Render {children}
- Include Navbar at top
- Create layout wrapper with Navbar + Sidebar + main content
- Add footer (if needed)
- Setup proper HTML structure
- Configure viewport meta tags for responsiveness
- Add font imports (if using custom fonts)

---

## Phase 5: Dashboard Implementation

### Step 5.1: Create Student Dashboard Component
**Location:** `components/dashboard/StudentDashboard.tsx`

Display sections:
- Welcome banner with student name
- Quick stats cards:
  - Total courses enrolled
  - In-progress courses count
  - Completed courses count
  - Total learning hours
- Recent courses section with:
  - Course card showing progress bar
  - Continue button to resume course
  - Link to course details
- Recommended courses section:
  - Based on interests or categories
  - Course cards with enrollment button
- Recent activity timeline (optional):
  - Lesson completed
  - Quiz taken
  - Certificate earned
- Announcements/notifications section
- Quick action buttons:
  - Browse courses
  - View my courses
  - My progress

### Step 5.2: Create Instructor Dashboard Component
**Location:** `components/dashboard/InstructorDashboard.tsx`

Display sections:
- Welcome banner with instructor name
- Key metrics:
  - Total courses created
  - Total students enrolled
  - Total revenue generated
  - Average course rating
- Courses section:
  - Published courses list
  - Draft courses list
  - Ability to create new course
- Recent activity:
  - New enrollments
  - Quiz submissions
  - Student questions (if applicable)
- Students overview:
  - Total students
  - Active students
  - Link to view all students
- Analytics section:
  - Revenue chart
  - Enrollment trend
  - Student performance
- Quick actions:
  - Create course button
  - View analytics button
  - Message students button

### Step 5.3: Create Admin Dashboard Component
**Location:** `components/dashboard/AdminDashboard.tsx`

Display sections:
- System overview metrics:
  - Total users (students, instructors, admins)
  - Total courses
  - Total enrollments
  - Platform revenue
  - Active users today
- User management section:
  - New users today
  - Pending instructor approvals
  - Suspended users count
  - Link to user management
- Content overview:
  - Published courses
  - Draft courses
  - Reported content
  - Link to content management
- Approvals pending:
  - Instructor applications list
  - Quick approve/reject buttons
  - Applicant details preview
- System health (optional):
  - API status
  - Database status
  - Recent errors
- Quick actions:
  - View all users
  - View approvals
  - View analytics
  - System settings

### Step 5.4: Create Dashboard Page Router
**Location:** `app/dashboard/page.tsx`

Page logic:
- Check if user is authenticated (redirect to login if not)
- Get user role from auth store
- Conditionally render appropriate dashboard:
  - StudentDashboard if role is STUDENT
  - InstructorDashboard if role is INSTRUCTOR
  - AdminDashboard if role is ADMIN
- Handle loading state while fetching data
- Handle error state if data fetch fails
- Add proper metadata for SEO
- Setup page title and breadcrumbs

---

## Phase 6: Course Management

### Step 6.1: Create Course Card Component
**Location:** `components/courses/CourseCard.tsx`

Card display:
- Course image/thumbnail
- Course title
- Instructor name
- Short description (truncated)
- Course level badge (Beginner, Intermediate, Advanced)
- Course status badge (if applicable)
- Star rating with review count
- Price display:
  - Original price (struck-through if discounted)
  - Current price in bold
- Progress bar (if user is enrolled)
- Enrollment count
- Hover effect with shadow
- Click handler to navigate to course details
- Role-specific buttons:
  - Student: "Enroll" or "Resume" button
  - Instructor: "Edit" and "Delete" buttons
  - Admin: "Publish/Unpublish" buttons

### Step 6.2: Create Courses Listing Page
**Location:** `app/courses/page.tsx`

Page features:
- Header with "Browse Courses" title
- Search bar to filter courses by title
- Filter options:
  - Category dropdown
  - Level filter (Beginner, Intermediate, Advanced)
  - Price range slider
  - Sort options (newest, most popular, highest rated, lowest price)
- Grid layout of CourseCard components
- Pagination or infinite scroll
- Empty state message if no courses found
- Loading skeleton cards while fetching
- Error state if fetch fails
- Responsive grid (3 columns desktop, 1-2 mobile)
- Quick action buttons (Filters toggle on mobile)

### Step 6.3: Create Course Details Page
**Location:** `app/courses/[id]/page.tsx`

Page sections:
- Course header with:
  - Large course image
  - Course title
  - Instructor name and avatar
  - Overall rating and review count
  - Enrollment count
- Course information section:
  - Description
  - Level, duration, language
  - Skills you'll learn (as list)
- Pricing section:
  - Price display with discount badge if applicable
  - Enroll/Buy button
  - Share buttons
- Course curriculum section:
  - Collapsible sections/modules
  - Lessons list under each section
  - Lesson titles, duration, type (video, quiz, resource)
  - Marked as complete/locked based on enrollment
- Requirements section:
  - Prerequisites list
- Instructor information card:
  - Instructor name, avatar, headline
  - Brief bio
  - Link to instructor profile
  - Contact instructor button (if enrolled)
- Reviews section:
  - Average rating display
  - Review breakdown by stars
  - List of reviews with:
    - Reviewer name
    - Rating
    - Date
    - Review text
    - Helpful voting
  - Write a review button (if enrolled and completed)
- Related courses section

### Step 6.4: Create Instructor Courses List Page
**Location:** `app/dashboard/courses/page.tsx` (new)

Page features:
- Header with "My Courses"
- Tabs or filter: All, Published, Draft
- Table or card view toggle
- Courses table/list with columns:
  - Course title
  - Status (Published/Draft)
  - Enrollment count
  - Revenue (if applicable)
  - Rating
  - Last updated date
  - Action buttons (Edit, Delete, View Analytics, Publish/Unpublish)
- Create new course button
- Bulk actions (if multiple selected)
- Search and filter by title
- Empty state if no courses
- Modal or page for each action:
  - Edit course
  - View analytics
  - Delete confirmation

### Step 6.5: Create Course Creation Form
**Location:** `app/dashboard/create-course/page.tsx` (new)

Form sections:
1. Basic Information:
   - Course title input
   - Course description (rich text editor)
   - Category dropdown
   - Course level dropdown
   - Language dropdown
   
2. Pricing:
   - Price input
   - Discount price input
   - Free course toggle
   
3. Media:
   - Course thumbnail upload
   - Course video preview upload
   
4. Course Content:
   - Sections/modules creator
   - Add lessons under each section
   - Drag-and-drop reordering
   
5. Learning Outcomes:
   - Add skills students will learn
   - Add requirements/prerequisites
   
6. Submission:
   - Save as draft button
   - Publish course button
   - Preview course button
   
Form validations:
- Required field checks
- File size/type validation for uploads
- Length checks for text fields

---

## Phase 7: Enrollment & Learning

### Step 7.1: Create Enrollment Component
**Location:** `components/courses/EnrollmentButton.tsx` (new)

Features:
- Single button based on enrollment status:
  - "Enroll Now" if not enrolled
  - "Already Enrolled" if enrolled
  - "Resume Learning" if in progress
  - "Completed" if course finished
- On click, call enroll API
- Show loading state during enrollment
- Show success message after enrollment
- Show error message if enrollment fails
- Redirect to course content after enrollment
- Disable button based on prerequisites (if applicable)
- Payment modal for paid courses (if applicable)

### Step 7.2: Create Lesson Display Component
**Location:** `components/courses/LessonDisplay.tsx` (new)

Features:
- Lesson video player
- Lesson title and description
- Lesson resources (downloadable files)
- Mark as complete button
- Previous/Next lesson navigation
- Sidebar with:
  - Lesson list of current section
  - Current lesson highlighted
  - Completed lessons marked with checkmark
  - Lock icon on locked lessons
- Comments/Q&A section (optional)
- Keyboard shortcuts (optional)

### Step 7.3: Create Progress Tracking
**Location:** `components/courses/ProgressTracker.tsx` (new)

Features:
- Overall course progress percentage
- Progress bar showing completion
- Breakdown by section:
  - Section name
  - Lessons completed / total lessons
  - Progress percentage
- Time spent on course
- Time remaining estimate
- Sections completion status

### Step 7.4: Create My Courses Page
**Location:** `app/dashboard/my-courses/page.tsx` (new)

Page features:
- "My Courses" header
- Tabs: Active, Completed, Dropped
- Course list with cards showing:
  - Course thumbnail
  - Course title
  - Instructor name
  - Progress bar
  - Last accessed date
  - Continue learning button
  - View certificate button (if completed)
- Search and sort options
- Grid or list view toggle
- Empty state messages for each tab

---

## Phase 8: Quizzes & Assessments

### Step 8.1: Create Quiz Start Component
**Location:** `components/quiz/QuizStart.tsx` (new)

Features:
- Quiz title and description
- Quiz details:
  - Total questions
  - Time limit
  - Passing score
  - Attempts allowed
- Start button
- Instructions section
- Confirm before starting modal

### Step 8.2: Create Quiz Question Display
**Location:** `components/quiz/QuestionDisplay.tsx` (new)

Features:
- Question text
- Question type handling:
  - Multiple choice (radio buttons)
  - Multiple select (checkboxes)
  - True/False
  - Short answer (text input)
  - Essay (text area)
- Options display
- Previous/Next question buttons
- Question navigation sidebar:
  - All questions list
  - Current question highlighted
  - Answered questions marked
  - Unanswered questions marked
  - Flagged questions marked
- Flag for review button
- Question timer (if time limit applies)
- Submit quiz button at end

### Step 8.3: Create Quiz Results Component
**Location:** `components/quiz/QuizResults.tsx` (new)

Features:
- Score display (prominent)
- Pass/Fail status
- Performance metrics:
  - Percentage score
  - Total time taken
  - Correct answers count
  - Incorrect answers count
  - Skipped questions count
- Review answers option:
  - Show each question with:
    - Question text
    - User's answer
    - Correct answer
    - Explanation (if provided)
- Retake quiz button (if attempts remain)
- Continue to next lesson button
- Share results (optional)
- Download results button (optional)

---

## Phase 9: Admin Panel

### Step 9.1: Create Users Management Page
**Location:** `app/admin/users/page.tsx` (new)

Features:
- Users table with columns:
  - User name
  - Email
  - Role
  - Status (Active, Suspended, Inactive)
  - Joined date
  - Action buttons
- Search by name or email
- Filter by role (Student, Instructor, Admin)
- Filter by status
- Sort options
- Pagination
- Row actions:
  - View profile
  - Ban/Suspend user
  - Change role
  - Delete user (with confirmation)
- Bulk actions
- Add new user button (if applicable)

### Step 9.2: Create Instructor Approvals Page
**Location:** `app/admin/approvals/page.tsx` (new)

Features:
- Pending approvals table with columns:
  - Applicant name
  - Email
  - Applied date
  - Expertise/specialization
  - Bio preview
  - Action buttons
- Filter by status (Pending, Approved, Rejected)
- Search by name or email
- Expand row to see full details:
  - Full bio
  - Education background
  - Certifications
  - Years of experience
- Approve button:
  - Shows confirmation
  - Creates INSTRUCTOR account
  - Sends approval email
  - Updates request status
- Reject button:
  - Opens modal for rejection reason
  - Sends rejection email with reason
  - Updates request status

### Step 9.3: Create Courses Management Page
**Location:** `app/admin/courses/page.tsx` (new)

Features:
- Courses table with columns:
  - Course title
  - Instructor name
  - Status (Draft, Published, Archived)
  - Enrollment count
  - Revenue
  - Rating
  - Created date
  - Action buttons
- Search and filter options
- Sort options
- Row actions:
  - View course
  - Publish/Unpublish
  - Archive course
  - Delete course
  - View analytics
- Bulk actions (publish multiple, etc.)
- Quick stats at top (total courses, published, draft, archived)

### Step 9.4: Create Analytics Page
**Location:** `app/admin/analytics/page.tsx` (new)

Features:
- Key metrics cards:
  - Total users, revenue, courses, enrollments
- Charts:
  - User growth over time
  - Revenue trend
  - Enrollment trend
  - Top courses by enrollment
  - Top instructors by revenue
- Date range selector
- Export data option
- Filter by category (optional)

---

## Phase 10: Advanced Features

### Step 10.1: Create Course Reviews Component
**Location:** `components/courses/ReviewSection.tsx` (new)

Features:
- Review form (for enrolled users):
  - Star rating selector
  - Review text area
  - Submit button
  - Cancel button
- Reviews list:
  - Review card with:
    - Reviewer name
    - Avatar
    - Star rating
    - Review date
    - Review text
    - Helpful/Not helpful buttons
    - Delete button (if own review)
- Sort reviews by (Recent, Helpful, Highest rated)
- Pagination for reviews

### Step 10.2: Create Certificate Display
**Location:** `components/courses/Certificate.tsx` (new)

Features:
- Certificate template display:
  - Student name
  - Course name
  - Completion date
  - Certificate number
  - Instructor signature (image)
- Download certificate button (PDF)
- Share certificate button
- Print certificate button
- Certificate authenticity link

### Step 10.3: Create Analytics Dashboard (Instructor)
**Location:** `app/dashboard/analytics/page.tsx` (new)

Features:
- Overview metrics:
  - Total students, revenue, average rating
- Charts:
  - Revenue chart
  - Student enrollment trend
  - Course performance comparison
  - Student progress distribution
- Top performing courses
- Student activity timeline
- Date range selector
- Export report button

### Step 10.4: Create Notifications System
**Location:** `components/shared/Notifications.tsx` (new)

Features:
- Notification bell icon in navbar
- Badge showing unread count
- Dropdown menu with:
  - List of recent notifications
  - Mark as read/unread
  - Delete notification
  - Clear all button
- Notification types:
  - Enrollment notifications
  - Quiz submissions
  - Course updates
  - Admin messages
  - System announcements
- In-app toast notifications for actions
- Optional email notifications preference

---

## Phase 11: Error Handling & Validation

### Step 11.1: Create Error Boundary Component
**Location:** `components/shared/ErrorBoundary.tsx` (new)

Features:
- Catch React errors
- Display error message to user
- Show error details in development
- Provide recovery options (reload, go home)
- Log error to monitoring service

### Step 11.2: Create Form Validation System
**Location:** `lib/validation/` (new directory)

Features:
- Validation functions for each form type:
  - Email validation
  - Password strength validation
  - URL validation
  - Required field validation
- Real-time validation feedback
- Display error messages under fields
- Disable submit button if invalid
- Field-level and form-level validation

### Step 11.3: Create Error Pages
**Location:** `app/error.tsx`, `app/not-found.tsx`

Features:
- 404 Not Found page
- 500 Server Error page
- Custom error messages
- Links back to home or previous page
- Error code display

---

## Phase 12: Performance & Optimization

### Step 12.1: Implement Lazy Loading
Features:
- Code splitting for routes
- Lazy load heavy components
- Skeleton loaders while components load
- Image lazy loading
- Pagination instead of infinite scroll (if applicable)

### Step 12.2: Implement Caching Strategy
Features:
- Cache API responses in Zustand store
- Revalidate data at intervals
- Manual refresh option for users
- Cache invalidation on data mutations

### Step 12.3: Optimize Images
Features:
- Convert images to WebP format
- Use Next.js Image component for optimization
- Set appropriate image sizes
- Use srcSet for different device sizes
- Lazy load images
- Compress images

---

## Phase 13: Testing

### Step 13.1: Setup Testing Infrastructure
- Configure Jest for unit testing
- Setup React Testing Library for component tests
- Configure Cypress or Playwright for E2E testing
- Create test utilities and helpers

### Step 13.2: Unit Testing Strategy
- Test utility functions in `utils/`
- Test validation functions
- Test date formatting, currency formatting, etc.
- Test constants and enums

### Step 13.3: Component Testing Strategy
- Test form components (login, register, etc.)
- Test user interactions (button clicks, form submission)
- Test conditional rendering based on props
- Test error states
- Test loading states

### Step 13.4: Integration Testing Strategy
- Test complete user flows:
  - Register → Login → Dashboard → Enroll → Take Quiz
  - Login → View Courses → Enroll → Complete Lesson
  - Admin approval flow
- Test API integration
- Test state management

### Step 13.5: E2E Testing Strategy
- Test critical user journeys in browser
- Test responsive design on different screen sizes
- Test accessibility
- Test performance metrics

---

## Phase 14: Deployment Preparation

### Step 14.1: Environment Configuration
- Create environment files for different stages:
  - Development (`.env.local`)
  - Staging (`.env.staging`)
  - Production (`.env.production`)
- Verify all environment variables are set
- Update API URLs for each environment

### Step 14.2: Build Optimization
- Run `npm run build`
- Verify no build errors
- Check build size and warnings
- Optimize bundle if needed
- Verify all routes generate properly
- Check static file optimization

### Step 14.3: Security Checklist
- Verify sensitive data not exposed in frontend
- Check environment variables not committed to git
- Verify API calls use HTTPS
- Check CORS configuration
- Verify authentication checks on all protected pages
- Check for XSS vulnerabilities
- Verify CSRF protection if needed
- Check for exposed API keys

### Step 14.4: Performance Checklist
- Measure Lighthouse score
- Check Core Web Vitals
- Verify image optimization
- Check CSS bundle size
- Check JavaScript bundle size
- Verify lazy loading works
- Check caching headers

---

## Phase 15: Deployment

### Step 15.1: Choose Hosting Platform
- Options: Vercel (recommended for Next.js), Netlify, AWS, Digital Ocean, etc.
- Configure domain name
- Setup SSL/TLS certificate

### Step 15.2: Setup CI/CD Pipeline
- Connect GitHub repository
- Configure automated builds
- Setup automated tests
- Configure automatic deployment on main branch
- Setup preview deployments for PRs

### Step 15.3: Deploy to Staging
- Deploy to staging environment first
- Run full test suite
- Manual testing on staging
- Performance testing
- Security testing

### Step 15.4: Deploy to Production
- Create production build
- Deploy to production environment
- Verify all routes working
- Test critical user flows
- Monitor for errors
- Setup error tracking (Sentry, etc.)
- Setup analytics (Google Analytics, etc.)

---

## Phase 16: Maintenance & Monitoring

### Step 16.1: Setup Monitoring
- Error tracking (Sentry, Rollbar, etc.)
- Performance monitoring
- Uptime monitoring
- User behavior analytics
- Log aggregation

### Step 16.2: Setup Alerting
- Alert on critical errors
- Alert on performance degradation
- Alert on deployment failures
- Alert on uptime issues
- Slack/Email integration for alerts

### Step 16.3: Regular Maintenance
- Monitor error logs regularly
- Review performance metrics
- Update dependencies monthly
- Security patches as released
- User feedback review
- Feature requests tracking

### Step 16.4: Documentation
- API documentation for frontend developers
- Component library documentation
- Setup instructions for new developers
- Deployment procedures
- Troubleshooting guide

---

## Summary of Implementation Order

1. **Setup** → API client, Auth store, Context, Types
2. **Auth** → Login/Register forms and pages
3. **Layout** → Navbar, Sidebar, Root layout
4. **Dashboard** → Role-based dashboards
5. **Courses** → Listing, details, enrollment
6. **Learning** → Lessons, progress, quizzes
7. **Admin** → User management, approvals, analytics
8. **Features** → Reviews, certificates, notifications
9. **Quality** → Error handling, validation, testing
10. **Optimization** → Performance, caching, lazy loading
11. **Deployment** → Build, deploy, monitor

---

## Key Principles to Follow

- **Always check authentication** before rendering protected pages
- **Handle loading and error states** in every component that fetches data
- **Validate user input** before sending to API
- **Use TypeScript types** throughout for type safety
- **Keep components small and focused** for reusability and testing
- **Use custom hooks** to extract data fetching logic
- **Store auth data in both store and localStorage** for persistence
- **Implement proper error boundaries** to catch component errors
- **Use environment variables** for configuration
- **Optimize images and code splitting** for performance
- **Test critical user flows** before deployment
- **Monitor and track errors** in production
- **Document code and setup** for team maintenance
