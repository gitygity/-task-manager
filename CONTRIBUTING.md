# Contributing to Task Manager 🤝

Thank you for your interest in contributing to our Task Manager project! We welcome contributions from developers of all skill levels.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Code of Conduct](#code-of-conduct)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** (comes with Node.js)
- **Git** for version control
- A code editor (VS Code recommended)

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/task-manager.git
   cd task-manager
   ```
3. **Add** the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/gitygity/task-manager.git
   ```

---

## 💻 Development Setup

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run commit       # Conventional commits
```

---

## 📝 Coding Standards

### TypeScript

- **Always** use TypeScript for new code
- **Define** proper interfaces and types
- **Avoid** using `any` type
- **Use** strict mode configuration

### React Components

- **Use** functional components with hooks
- **Follow** the established folder structure
- **Create** reusable components in `src/components/`
- **Use** proper prop types and default values

### Styling

- **Use** TailwindCSS for styling
- **Prefer** shadcn/ui components over custom components
- **Follow** the existing design system
- **Ensure** responsive design

### Code Structure

```
src/
├── components/          # Shared UI components
├── features/           # Feature-based modules
├── layouts/            # Application layouts
├── pages/              # Page components
├── routes/             # Routing configuration
└── lib/                # Utilities and helpers
```

---

## 📜 Commit Guidelines

We use **Conventional Commits** for clear commit history.

### Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code formatting (no logic changes)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Examples

```bash
feat(auth): add login form validation
fix(tasks): resolve task deletion bug
docs(readme): update installation instructions
style(components): format button component
refactor(routes): simplify route configuration
test(auth): add login component tests
chore(deps): update dependencies
```

### Using Commitizen

```bash
# Interactive commit tool
npm run commit

# Or use git alias
git cz
```

---

## 🔄 Pull Request Process

### Before Creating a PR

1. **Sync** with upstream:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make** your changes following coding standards

4. **Test** your changes:
   ```bash
   npm run build
   npm run lint
   ```

5. **Commit** using conventional commits:
   ```bash
   npm run commit
   ```

### Creating the PR

1. **Push** your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create** a Pull Request on GitHub

3. **Fill out** the PR template with:
   - Clear description of changes
   - Screenshots (if UI changes)
   - Testing instructions
   - Related issues

### PR Requirements

- [ ] Code follows project standards
- [ ] All tests pass
- [ ] No ESLint errors
- [ ] Conventional commit messages
- [ ] PR description is clear and complete
- [ ] Screenshots included (for UI changes)

---

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search** existing issues to avoid duplicates
2. **Check** if it's already fixed in the latest version
3. **Try** to reproduce the issue

### Bug Reports

Include:
- **Description** of the bug
- **Steps** to reproduce
- **Expected** vs **Actual** behavior
- **Environment** details (OS, browser, Node version)
- **Screenshots** or error messages

### Feature Requests

Include:
- **Problem** you're trying to solve
- **Proposed** solution
- **Alternative** solutions considered
- **Additional** context or mockups

---

## 🏷️ Labels and Projects

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - High priority issues

### Development Labels

- `status: in progress` - Currently being worked on
- `status: needs review` - Ready for review
- `status: blocked` - Blocked by dependencies

---

## 🤝 Code of Conduct

### Our Standards

- **Be respectful** and inclusive
- **Use welcoming** and inclusive language
- **Be collaborative** and constructive
- **Focus on** what's best for the community
- **Show empathy** towards other community members

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or trolling
- Public or private harassment
- Publishing others' private information
- Other conduct that's unprofessional

---

## 🎯 Development Guidelines

### Adding New Features

1. **Discuss** the feature in an issue first
2. **Follow** the existing architecture patterns
3. **Add** proper TypeScript types
4. **Include** error handling
5. **Update** documentation if needed

### Bug Fixes

1. **Reproduce** the bug first
2. **Write** a test that fails (if applicable)
3. **Fix** the bug
4. **Verify** the test passes
5. **Ensure** no regressions

### Documentation

- **Update** README if needed
- **Add** JSDoc comments for complex functions
- **Update** API documentation
- **Include** examples where helpful

---

## 🚀 Release Process

Releases are handled by maintainers:

1. **Merge** approved PRs to main
2. **Run** automated tests
3. **Create** release notes
4. **Tag** the release
5. **Deploy** to production

---

## ❓ Getting Help

- **GitHub Issues** - For bug reports and feature requests
- **Discussions** - For questions and community chat
- **Email** - For security issues (coming soon)

---

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Conventional Commits](https://www.conventionalcommits.org)

---

Thank you for contributing to make Task Manager better! 🎉 