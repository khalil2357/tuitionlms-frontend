# TuitionLMS Frontend

Modern Next.js-based frontend for TuitionLMS learning management system.

## Tech Stack

- **Framework:** Next.js 14 with React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Client:** Axios
- **State Management:** Zustand

## Project Structure

```
tuitionlms-frontend/
├── app/                    # App Router pages and layouts
├── pages/                  # Pages Router (legacy)
├── components/             # Reusable React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── utils/                  # Helper functions
├── types/                  # TypeScript type definitions
├── styles/                 # Global styles
├── public/                 # Static assets
└── api/                    # API route handlers
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

- 🎓 Student Dashboard
- 👨‍🏫 Instructor Dashboard
- 👨‍💼 Admin Control Panel
- 📚 Course Management
- 📝 Quiz System
- 📊 Analytics & Reports
- 🔐 Role-Based Access Control
- 📱 Responsive Design

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT
