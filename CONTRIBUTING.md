# Contributing to The Chattala

Thank you for your interest in contributing to The Chattala! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/thechattala.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes: `npm run lint && npm run build`
6. Commit your changes: `git commit -m "Add: your feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Workflow

### Prerequisites
- Node.js 20.x or higher
- npm, yarn, pnpm, or bun

### Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

### Code Quality
Before submitting a PR, ensure:
- [ ] Code passes linting: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] Code follows existing patterns and conventions

## Code Style

- Use TypeScript for all new files
- Follow the existing code structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

## Commit Messages

Use clear and descriptive commit messages:
- `Add: new feature`
- `Fix: bug description`
- `Update: existing feature`
- `Remove: obsolete code`
- `Refactor: code improvement`
- `Docs: documentation update`

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure your PR description clearly describes the problem and solution
3. Link any relevant issues
4. Request review from maintainers
5. Address any feedback promptly

## Questions?

Feel free to open an issue for any questions or concerns.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
