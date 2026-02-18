# The Chattala

A hyperlocal community platform for Chattala - connecting local communities through modern web technologies.

## Overview

The Chattala is a Next.js-based platform designed to serve hyperlocal communities, providing a space for local engagement, information sharing, and community building.

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

## Installation

1. Clone the repository:
```bash
git clone https://github.com/abumdselim/thechattala.git
cd thechattala
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

## Development Workflow

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Code Quality

Run linting:

```bash
npm run lint
```

Fix linting issues automatically:

```bash
npm run lint:fix
```

Check TypeScript types:

```bash
npm run type-check
```

## Project Structure

```
thechattala/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── public/                 # Static assets
├── .editorconfig          # Editor configuration
├── .gitignore             # Git ignore rules
├── .nvmrc                 # Node version specification
├── .prettierrc            # Prettier configuration
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Project dependencies
├── postcss.config.mjs     # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Technology Stack

- **Framework**: Next.js 16.x (App Router)
- **React**: 19.x
- **Styling**: Tailwind CSS 4.x
- **Language**: TypeScript 5.x
- **Linting**: ESLint 9.x

## Key Features

- Modern Next.js App Router architecture
- System font stack for optimal performance
- TypeScript for type safety
- Tailwind CSS for utility-first styling
- Dark mode support

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security

For security considerations and known vulnerabilities, please see [SECURITY.md](SECURITY.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Support

For issues and questions, please use the [GitHub issue tracker](https://github.com/abumdselim/thechattala/issues).

