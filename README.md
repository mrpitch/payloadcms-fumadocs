# PayloadCMS + Fumadocs Documentation Platform

A modern documentation platform that combines PayloadCMS for content management with Fumadocs for documentation rendering. Built with Next.js and PostgreSQL.

## Overview

This project provides:

- A headless CMS with rich text editing (PayloadCMS)
- A modern documentation UI framework (Fumadocs)
- Server-side rendering and static generation (Next.js)
- Database-backed content storage (PostgreSQL)
- Docker support for local development
- Comprehensive testing suite

## Documentation

- [Project Overview](docs/project.md) - Features, structure, and components
- [Technical Overview](docs/technical-overview.md) - Architecture and project structure
- [Fumadocs Integration](docs/fumadocs-integration.md) - How PayloadCMS and Fumadocs work together
- [Integration Summary](docs/integration-summary.md) - Quick reference guide
- [Fumadocs Utils](docs/fumadocs-utils.md) - Integration utilities and implementation details

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

## Quick Start

1. Clone the repository

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment:

   ```bash
   cp test.env .env.local
   # Configure DATABASE_URL and PAYLOAD_SECRET
   ```

4. Start PostgreSQL:

   ```bash
   pnpm start:postgres
   ```

5. Run seeding:

   ```bash
   pnpm seed
   ```

6. Start development server:

   ```bash
   pnpm dev
   ```

The app will be available at `http://localhost:3000`. The admin panel is at `/admin` and documentation at `/docs`.

## Environment Setup

Required environment variables:

```bash
DATABASE_URL=postgres://user:pass@localhost:5432/docs
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## Docker Support

The project includes Docker configuration for PostgreSQL. To use it:

1. Configure environment variables in `.env.local`

2. Start PostgreSQL container:

   ```bash
   pnpm start:postgres
   ```

3. To stop the container:

   ```bash
   pnpm stop:postgres
   ```

4. To remove volumes:

   ```bash
   pnpm stop:postgres:cleanup
   ```

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

## Project Structure

```text
src/
├── app/                    # Next.js app directory
│   ├── (fumadocs)/        # Documentation routes
│   │   ├── docs/          # Documentation pages
│   │   └── layout.tsx     # Fumadocs layout
│   └── (payload)/         # PayloadCMS routes
│       ├── admin/         # Admin panel
│       └── api/           # API endpoints
├── lib/                   # Core utilities
│   ├── fumadocs/         # Fumadocs integration
│   ├── hooks/            # React hooks
│   └── styles/           # CSS and themes
└── payload/              # PayloadCMS configuration
    ├── content-model/    # Collection definitions
    ├── fields/          # Field types
    └── hooks/           # PayloadCMS hooks
```

## Features

### PayloadCMS Collections

- **Docs**: Main documentation content
  - Rich text editor (Lexical)
  - Versioning support
  - Draft/publish workflow

- **Media**: Asset management
  - Image optimization
  - Automatic resizing
  - Metadata handling

- **Settings**: Global configuration
  - Site metadata
  - Navigation structure
  - Theme settings

### Fumadocs Integration

- Server-side rendering
- Table of contents generation
- Full-text search
- Dark/light mode support
- Mobile-responsive design

## Available Scripts

### Development

```bash
pnpm dev          # Start development server
pnpm devsafe      # Start with clean cache
```

### Database

```bash
pnpm start:postgres      # Start PostgreSQL
pnpm stop:postgres      # Stop container
pnpm stop:postgres:cleanup  # Remove volumes
```

### Content Management

```bash
pnpm seed               # Seed initial content
pnpm generate:types     # Generate TS types
pnpm generate:importmap # Update admin imports
```

### Testing

```bash
pnpm test      # Run all tests
pnpm test:e2e  # Run Playwright tests
pnpm test:int  # Run Vitest tests
```

## License

MIT

## Support

For PayloadCMS support, visit the [official documentation](https://payloadcms.com/docs).
For Fumadocs help, check the [Fumadocs documentation](https://fumadocs.dev).
