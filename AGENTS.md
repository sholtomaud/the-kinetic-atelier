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

## SwiftUI Mobile Development Guidelines
### Core Principles
- **SwiftUI Native**: Exclusively use native SwiftUI views and modifiers for all interfaces.
- **MVVM Pattern**: Follow the Model-View-ViewModel (MVVM) architecture to maintain a clear separation of concerns.
- **TDD for SwiftUI**:
  - Write testable code using Dependency Injection and Protocols to mock hardware-dependent features (Vision, HealthKit).
  - Use `XCTest` for logic validation.
  - Development must be possible via Swift Package Manager (`swift build`, `swift test`) on non-macOS environments for pure business logic.

### UI Standards
- **Dynamic Type & Accessibility**: Ensure all views support accessibility labels and respect system dynamic type sizes.
- **Dark Mode**: Support system color schemes (`Color.primary`, `Color.secondary`) to ensure compatibility with light and dark modes.

### CI/CD for Swift
- **Pre-commit**: For any Swift-related changes, you MUST:
  1. Run unit tests: `swift test` (or `xcodebuild test` if available).
  2. Run linting: `swiftlint` (if available).
- **GitHub Actions**: Ensure the `.github/workflows` includes a macOS-based runner for full iOS builds and simulator tests.
