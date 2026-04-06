export interface Workout {
  id: string;
  date: string;
  title: string;
  type: 'Strength' | 'HIIT' | 'Conditioning' | 'Endurance';
  duration: number;
  volume: number;
  exercises: Array<{
    name: string;
    sets: Array<{ reps: number; weight: number }>;
  }>;
}

export interface NutritionLog {
  date: string;
  weight: number;
  bodyFat: number;
  caloriesConsumed: number;
  macrosConsumed: { p: number; c: number; f: number };
}

export interface UserGoals {
  weight: number;
  dailyCalories: number;
  macros: { p: number; c: number; f: number };
}

export interface Routine {
  id: string;
  name: string;
  type: string;
  target: string;
  duration: number;
  exercises: string[];
}

export interface State {
  user: {
    name: string;
    goals: UserGoals;
  };
  workouts: Workout[];
  nutrition: NutritionLog[];
  routines: Routine[];
}

type Listener = (state: State) => void;

class Store {
  private state: State;
  private listeners: Listener[] = [];

  constructor() {
    const savedState = localStorage.getItem('ka-state');
    if (savedState) {
      this.state = JSON.parse(savedState);
    } else {
      this.state = this.getInitialState();
    }
  }

  private getInitialState(): State {
    return {
      user: {
        name: 'Guest User',
        goals: {
          weight: 180,
          dailyCalories: 2100,
          macros: { p: 180, c: 250, f: 70 },
        },
      },
      workouts: [],
      nutrition: [],
      routines: [
        {
          id: '1',
          name: 'Peak Push Performance',
          type: 'Hypertrophy',
          target: 'Chest, Tris',
          duration: 55,
          exercises: ['Barbell Bench Press', 'Dumbbell Flyes', 'Tricep Pushdowns'],
        },
        {
          id: '2',
          name: 'The Kinetic Flow',
          type: 'Conditioning',
          target: 'Full Body',
          duration: 35,
          exercises: ['Burpees', 'Kettlebell Swings', 'Box Jumps'],
        },
      ],
    };
  }

  getState(): State {
    return JSON.parse(JSON.stringify(this.state));
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    localStorage.setItem('ka-state', JSON.stringify(this.state));
    this.listeners.forEach((l) => l(this.getState()));
    window.dispatchEvent(new CustomEvent('store-change', { detail: this.getState() }));
  }

  addWorkout(workout: Workout) {
    this.state.workouts.push(workout);
    this.notify();
  }

  updateNutrition(date: string, data: Partial<NutritionLog>) {
    const index = this.state.nutrition.findIndex((n) => n.date === date);
    if (index !== -1) {
      this.state.nutrition[index] = { ...this.state.nutrition[index], ...data };
    } else {
      this.state.nutrition.push({
        date,
        weight: data.weight || 0,
        bodyFat: data.bodyFat || 0,
        caloriesConsumed: data.caloriesConsumed || 0,
        macrosConsumed: data.macrosConsumed || { p: 0, c: 0, f: 0 },
      });
    }
    this.notify();
  }

  saveRoutine(routine: Routine) {
    this.state.routines.push(routine);
    this.notify();
  }

  updateUserGoals(goals: Partial<UserGoals>) {
    this.state.user.goals = { ...this.state.user.goals, ...goals };
    this.notify();
  }

  getWorkoutsByDateRange(start: Date, end: Date): Workout[] {
    return this.state.workouts.filter((w) => {
      const date = new Date(w.date);
      return date >= start && date <= end;
    });
  }

  getNutritionByDateRange(start: Date, end: Date): NutritionLog[] {
    return this.state.nutrition.filter((n) => {
      const date = new Date(n.date);
      return date >= start && date <= end;
    });
  }
}

export const store = new Store();
