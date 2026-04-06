# Agent Instructions for Kinetic Atelier

## Interface Rules
- **Native Web Components Only**: Do not use 3rd party libraries like Lit, React, or Vue for the interface. Use the standard `CustomElementRegistry` and `HTMLElement` base class.
- **BaseComponent**: All components should extend `BaseComponent` from `src/core/BaseComponent.ts`.
- **Styling**: Use Tailwind CSS (v4) classes directly in the HTML templates.

## Development Workflow (TDD)
- **TDD**: Practice Test-Driven Development.
- **Tests**: Write unit tests in Vitest and E2E tests in Playwright.
- **Pre-commit**: Before submitting any change, you MUST:
  1. Run unit tests: `npm test`
  2. Run E2E tests: `npm run test:e2e`
  3. Run linting: `npm run lint`
- **Requirement**: ALL tests must pass before submission.

## Architecture
- **Routing**: Use the `<app-router>` component for navigation.
- **State**: Keep state minimal or use attributes/properties for component communication.
