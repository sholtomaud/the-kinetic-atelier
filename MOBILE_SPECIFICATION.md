# SwiftUI Mobile Specification - Kinetic Atelier

## 1. Overview
The Kinetic Atelier mobile application is a native SwiftUI companion to the web platform. It provides a specialized focus on biometric tracking through manual entry and ML-enhanced data capture, while maintaining full feature parity with the core fitness dashboard.

## 2. Functional Requirements

### 2.1 Weight Tracking & Biometrics
- **Manual Entry**:
  - Users can manually input their daily weight (lbs/kg) and body fat percentage.
  - Integration with Apple HealthKit for bi-directional syncing of weight data.
- **ML Scale Recognition (Vision)**:
  - Utilize the device camera to photograph a digital or analog weight scale.
  - Implement on-device machine learning to recognize and extract numerical weight values from the image.
  - Provide a confirmation step for the user to verify the detected weight before saving.
- **Historical Analysis**:
  - View weight trends over configurable timeframes (7 days, 30 days, 90 days, All time).
  - Calculate velocity and delta relative to user-defined goals.

### 2.2 Feature Parity with Web Platform
- **Dashboard**: High-level summary of active days, calories burned, and current progress.
- **Exercise Log**:
  - Log new workouts (Strength, HIIT, etc.).
  - Searchable history of past sessions.
  - PR (Personal Best) tracking and visual highlights.
- **Nutrition Tracking**:
  - Daily calorie and macro logging.
  - Progress gauges for Protein, Carbs, and Fats.
- **Workout Planner**:
  - Calendar view for scheduling sessions.
  - Access to saved routines and templates.

## 3. UI Specification

### 3.1 App Structure & Navigation
- **Architecture**: Native SwiftUI using `NavigationStack` and `TabView`.
- **Primary Navigation**:
  - **Dashboard Tab**: Summary and recent activity.
  - **Log Tab**: Quick-action center for Weight, Nutrition, and Workouts.
  - **Planner Tab**: Calendar and routine management.
  - **Profile Tab**: User settings, goals, and Pro status.

### 3.2 Key Views

#### Weight Entry View
- **Components**:
  - Large numerical keypad for manual input.
  - Unit toggle (lbs/kg).
  - "Scan Scale" button to trigger camera interface.
- **Styling**: Clean, minimalist interface following HIG (Human Interface Guidelines).

#### ML Camera Interface
- **Components**:
  - Full-screen camera preview with a guided "focus area" for the scale display.
  - Real-time overlay indicating detected text/numbers.
  - Haptic feedback upon successful detection.
  - Confirmation modal showing the captured image and the extracted value.

#### Weight Trends (Charts)
- **Implementation**: Native SwiftUI charting framework.
- **Features**:
  - Line/Area chart for weight over time.
  - Interactive "Scrubber" to view specific data points on the timeline.
  - Trend lines showing "Goal Weight" vs "Actual Weight".

#### Dashboard & Feed
- **Components**:
  - Card-based layout for "Weekly Evolution".
  - Circular progress rings for caloric goals.
  - Vertical list for recent workout history.

### 3.3 Design Language
- **Theme**: Support for System Dark Mode and Light Mode.
- **Iconography**: SF Symbols for a consistent native iOS look and feel.
- **Typography**: San Francisco (System font), utilizing dynamic type sizes for accessibility.
- **Animations**: Fluid SwiftUI transitions (e.g., `matchedGeometryEffect` for card expansions).

## 4. Technical Requirements
- **Platform**: iOS 17.0+ (to leverage latest SwiftUI and Charting APIs).
- **Permissions**:
  - Camera access for ML scanning.
  - HealthKit permissions for data syncing.
  - Notifications for workout reminders and goal achievements.
- **Offline Support**: Local persistence (SwiftData or Core Data) with background synchronization to the AWS cloud backend.

## 5. Tooling & CI/CD Requirements

### 5.1 Jules Environment Requirements
- **Swift Toolchain**: Installation of the Swift compiler and Swift Package Manager (SPM) for building and testing on Linux/macOS.
- **Testing Framework**: Native `XCTest` for unit and integration testing.
- **Mocking**: Use of protocols and dependency injection to facilitate testing of Vision and HealthKit components without hardware access.
- **Build Automation**: Makefile or Swift Package scripts to run `swift build` and `swift test` within the CLI environment.

### 5.2 GitHub Actions Requirements
- **Runner**: macOS-latest runner to access Xcode command line tools (`xcodebuild`).
- **CI Workflow**:
  - **Linting**: Integration of `SwiftLint` to enforce style and conventions.
  - **Unit Tests**: Execute `xcodebuild test` for the iOS target using a destination simulator (e.g., iPhone 15).
  - **Build Verification**: Ensure the app compiles for both iOS and Simulator architectures.
  - **Artifacts**: Upload test results and build logs for failure diagnosis.
