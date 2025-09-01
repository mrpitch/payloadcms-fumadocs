# PayloadCMS + Fumadocs Documentation Platform

This project combines PayloadCMS as a headless CMS with Fumadocs for documentation rendering, creating a modern, database-backed documentation system with a great editing experience.

## 🚀 Key Features

- **PayloadCMS Backend**: Database-backed CMS with rich text editing
- **Fumadocs Frontend**: Fast, modern documentation UI
- **Next.js App Router**: Server-side rendering and static generation
- **TypeScript**: Full type safety throughout
- **Docker Support**: Easy PostgreSQL setup
- **Comprehensive Testing**: E2E and Integration tests
- **Seeding System**: Quick content population

## 📁 Project Structure

```text
.
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (fumadocs)/        # Documentation routes
│   │   │   ├── docs/          # Documentation pages
│   │   │   └── layout.tsx     # Fumadocs layout
│   │   └── (payload)/         # PayloadCMS routes
│   │       ├── admin/         # Admin panel
│   │       └── api/           # API endpoints
│   ├── components/            # Shared React components
│   ├── lib/                   # Core utilities
│   │   ├── fumadocs/         # Fumadocs integration
│   │   ├── hooks/            # React hooks
│   │   ├── seed/             # Database seeding
│   │   ├── styles/           # CSS and themes
│   │   └── utils/            # Helper functions
│   └── payload/              # PayloadCMS configuration
│       ├── content-model/    # Collection definitions
│       ├── fields/           # Field types
│       └── hooks/            # PayloadCMS hooks
└── tests/                    # Test suites
    ├── e2e/                 # End-to-end tests
    └── int/                 # Integration tests
```

## 🛠️ Scripts and Commands

### Development

- `pnpm dev`: Start development server
- `pnpm devsafe`: Start dev server with clean .next directory
- `pnpm build`: Build for production
- `pnpm start`: Run production server

### Database

- `pnpm start:postgres`: Start PostgreSQL via Docker
- `pnpm stop:postgres`: Stop PostgreSQL container
- `pnpm stop:postgres:cleanup`: Stop and remove volumes

### Content Management

- `pnpm seed`: Populate database with sample content
- `pnpm payload`: Run PayloadCMS CLI commands
- `pnpm generate:types`: Generate TypeScript types
- `pnpm generate:importmap`: Update admin panel imports

### Testing

- `pnpm test`: Run all tests
- `pnpm test:e2e`: Run Playwright E2E tests
- `pnpm test:int`: Run Vitest integration tests

### Maintenance

- `pnpm lint`: Run ESLint
- `pnpm nuke`: Clean node_modules and caches

## 🔧 Core Technologies

### PayloadCMS

- Headless CMS with PostgreSQL backend
- Lexical-based rich text editor
- REST and GraphQL APIs
- [Official Documentation](https://payloadcms.com/docs)

### Fumadocs

- Documentation UI framework
- Built for Next.js
- TOC and navigation features
- [Official Documentation](https://fumadocs.dev)

### Next.js

- App Router for modern routing
- Server components and streaming
- API routes for backend
- [Official Documentation](https://nextjs.org/docs)

### UI Components

- Tailwind CSS for styling
- shadcn/ui component system
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🗃️ Content Model

### Collections

- `docs`: Documentation pages
  - title: string
  - slug: string
  - excerpt: string
  - copy: Lexical JSON

### Globals

- `settings`
  - siteName: string
  - siteDescription: string
  - docsMenu: Menu structure
