import './index.css';
import '@/components/AppLayout';
import '@/views/DashboardView';
import '@/views/ExerciseLogView';
import '@/views/NutritionView';
import '@/views/WorkoutPlannerView';
import { AppRouter } from '@/router/AppRouter';

const root = document.getElementById('root');
if (root) {
  const layout = document.createElement('app-layout');
  const router = document.createElement('app-router') as AppRouter;
  router.id = 'main-router';

  layout.appendChild(router);
  root.appendChild(layout);

  // router is already defined as AppRouter if import worked.
  // The error "router.addRoute is not a function" suggests
  // that it's not yet upgraded or import failed.

  const initRouter = () => {
    router.addRoute('dashboard', 'dashboard-view');
    router.addRoute('exercise-log', 'exercise-log-view');
    router.addRoute('nutrition', 'nutrition-view');
    router.addRoute('workout-planner', 'workout-planner-view');
    router.handleRoute(true);
  };

  if (customElements.get('app-router')) {
      initRouter();
  } else {
      customElements.whenDefined('app-router').then(initRouter);
  }
}
