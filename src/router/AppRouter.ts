import { BaseComponent } from '@/core/BaseComponent';

export class AppRouter extends BaseComponent {
  private routes: Record<string, string> = {};
  private currentPath: string = '';

  protected render() {
    return `<div id="router-outlet"></div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', () => this.handleRoute());
    document.addEventListener('click', (e) => this.handleGlobalClick(e));
    this.handleRoute();
  }

  addRoute(path: string, componentTagName: string) {
    this.routes[path] = componentTagName;
  }

  private handleGlobalClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      const path = anchor.getAttribute('href')!.substring(1);
      this.navigate(path);
    }
  }

  navigate(path: string) {
    window.history.pushState({}, '', `#${path}`);
    this.handleRoute();
  }

  handleRoute(force: boolean = false) {
    const path = window.location.hash.substring(1) || 'dashboard';
    if (this.currentPath === path && !force) return;
    this.currentPath = path;
    const tagName = this.routes[path] || this.routes['dashboard'];

    if (tagName) {
      const outlet = this.querySelector('#router-outlet');
      if (outlet) {
        outlet.innerHTML = `<${tagName}></${tagName}>`;
      }
    }
    this.updateActiveLinks();
  }

  private updateActiveLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      const href = link.getAttribute('href')?.substring(1);
      if (href === this.currentPath) {
        link.classList.add('bg-white', 'text-primary', 'font-bold', 'shadow-sm');
      } else {
        link.classList.remove('bg-white', 'text-primary', 'font-bold', 'shadow-sm');
      }
    });
  }
}

customElements.define('app-router', AppRouter);
