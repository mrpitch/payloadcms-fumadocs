# Technical Overview

This document provides a detailed technical overview of the PayloadCMS + Fumadocs documentation platform.

## Architecture

### Core Technologies

- **PayloadCMS v3.52.0**: Headless CMS with PostgreSQL backend
- **Fumadocs v15.6.5**: Documentation UI framework
- **Next.js 15.3.2**: React framework with App Router
- **PostgreSQL**: Database backend
- **TypeScript**: Type safety throughout
- **Docker**: Container support for development

### Project Structure

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

## Content Model

### Collections

#### Docs Collection
- `title` (string, required)
- `slug` (string, unique)
- `excerpt` (string)
- `copy` (Lexical rich text)
- `status` (draft/published)
- `publishedAt` (date)
- `author` (relationship)

#### Media Collection
- Image handling
- Automatic resizing
- Metadata support

### Global Settings
- Site metadata
- Navigation structure
- Theme configuration

## Integration Points

### PayloadCMS Configuration
- PostgreSQL adapter
- Lexical rich text editor
- Authentication and permissions
- Media handling

### Fumadocs Integration
- Server-side rendering
- Page tree generation
- TOC extraction
- Navigation components

## Testing Strategy

### E2E Tests
- Playwright for browser testing
- Full user flow coverage
- Admin and docs interface testing

### Integration Tests
- Vitest for fast testing
- API endpoint validation
- Utility function coverage

## Development Workflow

### Local Development
1. Start PostgreSQL (Docker)
2. Run development server
3. Access admin at `/admin`
4. View docs at `/docs`

### Content Management
1. Create/edit content in admin
2. Manage navigation structure
3. Preview changes in draft mode
4. Publish when ready

## Deployment

### Requirements
- Node.js >=20.9.0
- PostgreSQL database
- Environment variables configured

### Environment Variables
```bash
DATABASE_URL=postgres://user:pass@localhost:5432/docs
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Build Process
1. Install dependencies
2. Generate types
3. Build application
4. Start production server
