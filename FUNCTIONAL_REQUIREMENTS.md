# Functional Requirements - Kinetic Atelier

## Overview
Kinetic Atelier is a high-performance fitness dashboard application built using Native Web Components. It provides a centralized platform for tracking physical performance, nutrition, and workout planning.

## 1. Core State Management (`Store`)
A centralized state management system using the Observer pattern will handle all application data.

### 1.1 State Data Model
- **User Profile**:
  - `name`: string
  - `goals`: { weight: number, dailyCalories: number, dailyMacros: { p: number, c: number, f: number } }
- **Workouts**: Array of objects:
  - `id`: string (UUID)
  - `date`: ISO Date string
  - `title`: string
  - `type`: 'Strength' | 'HIIT' | 'Conditioning' | 'Endurance'
  - `duration`: number (minutes)
  - `volume`: number (kg)
  - `exercises`: Array<{ name: string, sets: Array<{ reps: number, weight: number }> }>
- **Nutrition & Biometrics**: Array of logs:
  - `date`: ISO Date string (YYYY-MM-DD)
  - `weight`: number (lbs/kg)
  - `bodyFat`: number (%)
  - `caloriesConsumed`: number
  - `macrosConsumed`: { p: number, c: number, f: number }
- **Routines**: Array of saved workout templates:
  - `id`: string
  - `name`: string
  - `type`: string
  - `target`: string
  - `duration`: number
  - `exercises`: string[]

### 1.2 Actions & Functions
- `addWorkout(workout)`: Validates and persists a new workout.
- `updateNutrition(date, data)`: Merges new biometric or nutrition data into the log for a specific date.
- `saveRoutine(routine)`: Adds a new template to the routine library.
- `updateUserGoals(goals)`: Updates the target metrics.
- `getWorkoutsByDateRange(start, end)`: Returns filtered workouts.
- `getNutritionByDateRange(start, end)`: Returns filtered nutrition logs.

### 1.3 Event System
- `store-change`: Dispatched when any state property changes. Components subscribe to this to refresh their views.

---

## 2. Functional Requirements by View

### 2.1 Dashboard View (`dashboard-view`)
- **Metric Summaries**:
  - Calculate "Active Days" in the current week.
  - Sum "Calories Burned" from workouts in the current week.
  - Calculate "Weight Change" between the first and last recorded weight in the current month.
- **Visualizations**:
  - Render "Weight Loss Velocity" bar chart using D3.js based on the last 7 weight logs.
  - Render "Fueling Balance" gauge showing current day's calories vs. goal.
- **Activity Feed**:
  - Display the 3 most recent workouts.

### 2.2 Exercise Log View (`exercise-log-view`)
- **History List**:
  - Group workouts by date (Today, Yesterday, Older).
  - Display workout title, duration, total volume, and a summary of exercises performed.
- **Personal Best (PR) Tracking**:
  - Identify the maximum weight recorded for each exercise across all workouts.
  - Display PR cards with the exercise name, weight, and date achieved.
- **Action**: "Log New Exercise"
  - Trigger a modal to input workout details (Title, Type, Exercises, Sets, Reps, Weight).

### 2.3 Nutrition View (`nutrition-view`)
- **Biometric Tracking**:
  - Form to input "Current Weight" and "Body Fat %" for the current date.
  - Persist data to the `Store` and update charts immediately.
- **Weight Trajectory Chart**:
  - D3.js Line/Area chart showing weight trends over the last 30 days.
- **Fuel Quota**:
  - Circular progress bars for Calories, Protein, Carbs, and Fats.
  - Values calculated from the current day's nutrition logs vs. user goals.
- **AI Insights**:
  - (Mocked) Dynamic text generated based on macro balance (e.g., "Protein is low today").

### 2.4 Workout Planner View (`workout-planner-view`)
- **Monthly Calendar**:
  - Navigate between months.
  - Display indicators (dots/icons) on dates with scheduled or completed workouts.
- **Routine Builder (Drag & Drop)**:
  - List of available exercises that can be dragged into a "Build Your Session" drop zone.
  - Reorder exercises within the builder.
  - Save the built session as a new "Routine".
- **Library Integration**:
  - Click "Add to Plan" on a saved routine to schedule it on the selected calendar date.

---

## 3. UI/UX Requirements
- **Responsive Layout**: Sidebar collapses to a bottom-nav or hamburger menu on mobile.
- **Transitions**: Use CSS animations (fade-in, slide-in) when switching between views.
- **Persistence**: State should be persisted to `localStorage` to survive page reloads.
- **Iconography**: Use Lucide icons consistently for all actions and indicators.
