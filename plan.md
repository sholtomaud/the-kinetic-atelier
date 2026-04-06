# Implementation Plan: The Kinetic Atelier

This document outlines the requirements and steps to implement full functionality for The Kinetic Atelier using Vanilla TypeScript and Web Components.

## 1. Core Architecture
- **Language**: TypeScript (Strict mode).
- **Component Model**: Native Web Components (`customElements.define`).
- **Styling**: Tailwind CSS v4 (Utility-first).
- **State Management**: A centralized `Store` class using the Observer pattern to sync data across components.
- **Routing**: A custom `Router` class handling hash-based navigation and component lifecycle.

## 2. Component Specifications

### Layout Components
- `ka-app`: Root component managing the layout shell and router outlet.
- `ka-sidebar`: Desktop navigation with active state tracking.
- `ka-topnav`: Global search and user actions.
- `ka-bottom-nav`: Mobile-specific navigation bar.

### Feature Components
- `ka-dashboard`: 
  - Integration with `d3` for the Weight Velocity bar chart.
  - Dynamic rendering of "Weekly Evolution" items from the store.
- `ka-exercise-log`:
  - Searchable list of workout history.
  - `ka-pr-card`: Individual personal best tracking with improvement indicators.
- `ka-nutrition`:
  - `ka-trajectory-chart`: D3-powered area/bar chart for weight trends.
  - `ka-fuel-quota`: Circular progress component for caloric tracking.
- `ka-workout-planner`:
  - `ka-calendar`: Interactive grid with month navigation and workout indicators.
  - `ka-routine-builder`: Drag-and-drop interface using the `Drag and Drop API`.

## 3. Feature Implementation Requirements

### State Management
- **Workouts**: Array of workout objects (date, type, volume, exercises).
- **Nutrition**: Daily caloric intake, macros, and weight logs.
- **User**: Profile info and "Pro" status.

### Interactive Features
1. **Workout Logging**:
   - Modal-based form to input exercises, sets, and reps.
   - Validation for numeric inputs.
2. **Routine Builder**:
   - Implement `draggable="true"` on exercise items.
   - Drop zone with visual feedback and list reordering logic.
3. **Charts (D3.js)**:
   - Responsive resizing using `ResizeObserver`.
   - Tooltips for data points.
4. **AI Insights**:
   - Integration with Gemini API to generate personalized "Atelier Insights" based on user data.

---

# Cloud Hosting Requirements

To host The Kinetic Atelier in a production environment, the following infrastructure is required:

## 1. Static Asset Hosting
- **Requirement**: A high-performance web server or CDN to serve the compiled `dist/` folder.
- **Recommended Services**: 
  - **Google Cloud Run**: (Current) Containerized hosting with automatic scaling.
  - **Firebase Hosting**: Optimized for SPAs with global CDN and SSL.
  - **Vercel/Netlify**: Simple git-based deployment workflows.

## 2. Backend & Persistence
- **Database**: A NoSQL database like **Google Cloud Firestore** for real-time data syncing across devices.
- **Authentication**: **Firebase Authentication** for secure user login (Google, Email/Password).
- **Storage**: **Google Cloud Storage** for user-uploaded profile photos or workout media.

## 3. API & Security
- **Environment Variables**: Secure storage for `GEMINI_API_KEY` (e.g., Secret Manager).
- **CORS Configuration**: Ensure the backend allows requests from the production domain.
- **SSL/TLS**: Mandatory HTTPS for all traffic.

## 4. CI/CD Pipeline
- **Build Step**: `npm run build` to generate optimized production assets.
- **Automated Deployment**: GitHub Actions or Cloud Build to deploy on every push to the main branch.
