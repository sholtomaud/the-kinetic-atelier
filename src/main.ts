import './index.css';
import '@/components/AppLayout';
import '@/views/DashboardView';
import '@/views/ExerciseLogView';
import '@/views/NutritionView';
import '@/views/WorkoutPlannerView';
import '@/router/AppRouter';

const root = document.getElementById('root');
if (root) {
  root.innerHTML = `
    <app-layout>
        <app-router id="main-router"></app-router>
    </app-layout>
  `;

  const router = document.getElementById('main-router') as any;
  if (router) {
    router.addRoute('dashboard', 'dashboard-view');
    router.addRoute('exercise-log', 'exercise-log-view');
    router.addRoute('nutrition', 'nutrition-view');
    router.addRoute('workout-planner', 'workout-planner-view');
    router.handleRoute(true);
  }
}
