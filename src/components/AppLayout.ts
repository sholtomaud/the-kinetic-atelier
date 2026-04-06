import { BaseComponent } from '@/core/BaseComponent';

export class AppLayout extends BaseComponent {
  protected render() {
    return `
      <div class="flex min-h-screen bg-surface">
        <!-- Sidebar -->
        <aside class="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-low py-8 gap-4 z-40 border-r border-outline-variant/10">
          <div class="px-6 mb-8">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                <i data-lucide="dumbbell"></i>
              </div>
              <div>
                <p class="text-sm font-bold text-primary">Kinetic Atelier</p>
                <p class="text-[10px] uppercase tracking-widest text-on-surface-variant">Elite Performance</p>
              </div>
            </div>
          </div>
          <nav class="flex flex-col gap-1 pr-4">
            <a href="#dashboard" class="nav-link flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-white/50 rounded-r-full transition-all duration-300">
              <i data-lucide="layout-dashboard"></i>
              <span class="font-medium">Dashboard</span>
            </a>
            <a href="#exercise-log" class="nav-link flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-white/50 rounded-r-full transition-all duration-300">
              <i data-lucide="list-checks"></i>
              <span class="font-medium">Exercise Log</span>
            </a>
            <a href="#nutrition" class="nav-link flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-white/50 rounded-r-full transition-all duration-300">
              <i data-lucide="utensils"></i>
              <span class="font-medium">Nutrition</span>
            </a>
            <a href="#workout-planner" class="nav-link flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-white/50 rounded-r-full transition-all duration-300">
              <i data-lucide="calendar"></i>
              <span class="font-medium">Workout Planner</span>
            </a>
          </nav>
          <div class="mt-auto px-6">
            <div class="p-4 bg-surface-variant/40 rounded-xxl border border-outline-variant/15">
              <p class="text-xs font-bold text-primary mb-2">PRO PLAN</p>
              <p class="text-sm text-on-surface-variant mb-4 leading-snug">Unlock advanced biometrics & custom coach logic.</p>
              <button class="w-full py-2 bg-primary text-on-primary rounded-full text-xs font-bold transition-all active:scale-95">Upgrade to Pro</button>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 lg:ml-64 flex flex-col min-h-screen">
          <!-- Top Nav -->
          <header class="flex justify-between items-center w-full px-8 py-4 sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
            <div class="flex items-center gap-8">
              <span class="text-2xl font-bold tracking-tight text-primary lg:hidden">The Kinetic Atelier</span>
              <div class="relative group hidden md:block">
                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4"></i>
                <input type="text" placeholder="Find routine..." class="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary/40 w-64">
              </div>
            </div>
            <div class="flex items-center gap-4">
              <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
                <i data-lucide="bell"></i>
              </button>
              <button class="primary-gradient text-on-primary px-6 py-2 rounded-full font-bold text-sm hover:scale-95 transition-transform active:duration-150">Log Workout</button>
              <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
                <img src="https://picsum.photos/seed/fitness-user/100/100" alt="User" class="w-full h-full object-cover">
              </div>
            </div>
          </header>

          <div class="flex-1 p-8" id="layout-content">
          </div>
        </main>
      </div>
    `;
  }

  connectedCallback() {
      if (this.dataset.rendered) return;
      const existing = Array.from(this.childNodes);
      this.innerHTML = this.render();
      this.renderIcons();
      const outlet = this.querySelector('#layout-content');
      if (outlet) {
          existing.forEach(node => outlet.appendChild(node));
      }
      this.dataset.rendered = 'true';
      this.afterRender();
  }

  protected update() {}
}

customElements.define('app-layout', AppLayout);
