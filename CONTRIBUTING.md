# Contributing to TheChattala

Thank you for your interest in contributing to TheChattala! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/thechattala.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to your branch: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Write self-documenting code with comments only where necessary

### TypeScript

- Enable strict mode
- No `any` types unless absolutely necessary
- Define proper interfaces and types
- Use type inference where appropriate

### Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Follow the existing component structure

### Styling

- Use Tailwind CSS classes
- Follow the existing design system
- Ensure responsive design (mobile-first)
- Test on multiple screen sizes

### Database Changes

- Create migration files for schema changes
- Update Prisma schema first
- Run `npx prisma migrate dev` to create migration
- Test migrations thoroughly

## Pull Request Process

1. Update documentation if adding new features
2. Add tests if applicable
3. Ensure the build passes (`npm run build`)
4. Ensure linting passes (`npm run lint`)
5. Update README.md if needed
6. Request review from maintainers

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## Community

- Be respectful and constructive
- Help others learn and grow
- Follow our Code of Conduct
- Ask questions if unclear

## Bug Reports

When filing a bug report, please include:

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/environment details

## Feature Requests

For new features:

- Explain the problem you're solving
- Describe your proposed solution
- Consider alternatives
- Be open to discussion

Thank you for contributing! 🙏
