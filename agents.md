# Agent Instructions for Kinetic Atelier

## Interface Rules
- **Native Web Components Only**: Do not use 3rd party libraries like Lit, React, or Vue for the interface. Use the standard `CustomElementRegistry` and `HTMLElement` base class.
- **BaseComponent**: All components should extend `BaseComponent` from `src/core/BaseComponent.ts`.
- **Styling**: Use Tailwind CSS (v4) classes directly in the HTML templates. Since we are using Light DOM for easier Tailwind integration, be mindful of global style leakage.

## Tooling & Testing
- **Vite**: The project is built with Vite.
- **TDD**: Practice Test-Driven Development. Write unit tests in Vitest for logic and E2E tests in Playwright for user flows.
- **Vitest**: Unit tests are located in `src/**/__tests__/`.
- **Playwright**: E2E tests are located in `tests/`.
- **Linting**: Ensure `npm run lint` passes before submitting.

## Architecture
- **Routing**: Use the `<app-router>` component for navigation.
- **State**: Keep state minimal or use attributes/properties for component communication.
