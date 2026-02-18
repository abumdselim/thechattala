# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-18

### Added
- Initial Next.js 16 project setup with App Router
- Tailwind CSS v4 integration
- TypeScript configuration
- ESLint configuration with Next.js rules
- Comprehensive documentation (README, CONTRIBUTING, SECURITY)
- MIT License
- Environment variables template (.env.example)
- Editor configuration files (.editorconfig, .prettierrc)
- Node version specification (.nvmrc)

### Changed
- Removed Google Fonts dependency in favor of system fonts
- Updated metadata to reflect "The Chattala" project
- Enhanced .gitignore with more comprehensive patterns

### Fixed
- Build errors caused by blocked Google Fonts API in restricted environments

### Security
- Documented known ajv vulnerability in development dependencies (SECURITY.md)
- All CodeQL security scans pass with no alerts
