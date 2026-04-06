# Kinetic Atelier Mobile - Core Logic

This directory contains the core business logic, models, and services for the Kinetic Atelier mobile application, implemented as a Swift Package.

## Overview

The mobile application follows the **MVVM** pattern and leverages **SwiftUI**. To support development across different environments (including non-macOS), the core logic is decoupled from the UI and hardware-specific APIs (Vision, HealthKit) using Protocols and Dependency Injection.

## Development

### Prerequisites

- Swift 5.9+
- [SwiftLint](https://github.com/realm/SwiftLint) (optional, for linting)

### Common Tasks

- **Build**: `make build` or `swift build`
- **Test**: `make test` or `swift test`
- **Lint**: `make lint`
- **Clean**: `make clean`

## Architecture

- `Sources/KineticAtelierCore`: Core logic, models, and service protocols.
- `Tests/KineticAtelierCoreTests`: Unit tests for the core logic.

## CI/CD

Automated testing and linting are performed via GitHub Actions on every push to the main branch and pull requests.
