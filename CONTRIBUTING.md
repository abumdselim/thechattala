# Contributing to The Chattala

Thank you for your interest in contributing to The Chattala! We welcome contributions from the community.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Your environment (OS, Node version, browser, etc.)
- Screenshots if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:
- A clear and descriptive title
- A detailed description of the proposed enhancement
- Any relevant examples or mockups
- Explanation of why this enhancement would be useful

### Pull Requests

1. **Fork the repository** and create your branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Make your changes**:
   - Follow the existing code style
   - Write clear, concise commit messages
   - Add tests if applicable
   - Update documentation as needed

4. **Test your changes**:
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

5. **Commit your changes**:
   ```bash
   git commit -m "Add some feature"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/my-new-feature
   ```

7. **Open a Pull Request** with:
   - A clear title and description
   - Reference to any related issues
   - Screenshots for UI changes
   - Explanation of your changes

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting (Prettier configuration)
- Use meaningful variable and function names
- Write clear comments for complex logic

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

### TypeScript

- Enable strict type checking
- Avoid using `any` types
- Define interfaces for complex data structures
- Use type inference where possible

### React/Next.js

- Use functional components with hooks
- Follow Next.js App Router conventions
- Use Server Components by default, Client Components when needed
- Optimize for performance and accessibility

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Support dark mode where applicable

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `public/` - Static assets
- Configuration files at root level

## Getting Help

If you need help or have questions:
- Check existing issues and discussions
- Create a new issue with the "question" label
- Reach out to maintainers

## License

By contributing to The Chattala, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in the project's changelog and repository.

Thank you for contributing to The Chattala! 🎉
