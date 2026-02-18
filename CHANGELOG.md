# Changelog

All notable changes to The Chattala project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README with installation and development instructions
- CONTRIBUTING.md guide for contributors
- SECURITY.md documenting known vulnerabilities and security practices
- LICENSE file (MIT License)
- .editorconfig for consistent code formatting across editors
- .prettierrc for code formatting configuration
- .nvmrc to specify Node.js 20 requirement
- Enhanced .gitignore with IDE and OS-specific entries
- npm scripts for `lint:fix` and `type-check`
- Package.json metadata: description, author, license, and engine requirements

### Changed
- Replaced Google Fonts (Geist) with system font stack to fix build failures
- Updated app metadata with proper project title and description
- Enhanced body element to use system fonts for better performance
- Updated globals.css to reference system fonts

### Fixed
- Build failures caused by `next/font/google` network dependency
- Network connectivity issues during build process

### Security
- Documented 15 npm vulnerabilities (1 moderate, 14 high) in development dependencies
- All vulnerabilities are in ESLint-related packages and do not affect production

## [0.1.0] - 2026-02-18

### Added
- Initial Next.js 16 project setup with App Router
- React 19 integration
- Tailwind CSS 4 for styling
- TypeScript 5 for type safety
- ESLint 9 for code linting
- Dark mode support
- Basic project structure

[Unreleased]: https://github.com/abumdselim/thechattala/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/abumdselim/thechattala/releases/tag/v0.1.0
