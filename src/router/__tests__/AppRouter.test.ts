import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../AppRouter';
import { AppRouter } from '../AppRouter';

describe('AppRouter', () => {
  let router: AppRouter;

  beforeEach(() => {
    document.body.innerHTML = '';
    window.location.hash = '';
    router = document.createElement('app-router') as AppRouter;
    document.body.appendChild(router);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the router outlet', () => {
    expect(router.querySelector('#router-outlet')).not.toBeNull();
  });

  it('updates the outlet when a route is added and navigated', () => {
    router.addRoute('test', 'test-view');
    router.navigate('test');

    const outlet = router.querySelector('#router-outlet');
    expect(outlet?.innerHTML).toContain('<test-view></test-view>');
  });

  it('defaults to dashboard if route not found', () => {
    router.addRoute('dashboard', 'dashboard-view');
    router.handleRoute(true);

    const outlet = router.querySelector('#router-outlet');
    expect(outlet?.innerHTML).toContain('<dashboard-view></dashboard-view>');
  });
});
