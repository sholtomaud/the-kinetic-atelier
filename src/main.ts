import './index.css';
import { createIcons, icons } from 'lucide';
import * as d3 from 'd3';

// Simple Router
class Router {
  routes: Record<string, () => void> = {};
  currentPath: string = '';

  constructor() {
    window.addEventListener('popstate', () => this.handleRoute());
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const path = anchor.getAttribute('href')!.substring(1);
        this.navigate(path);
      }
    });
  }

  addRoute(path: string, callback: () => void) {
    this.routes[path] = callback;
  }

  navigate(path: string) {
    window.history.pushState({}, '', `#${path}`);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.hash.substring(1) || 'dashboard';
    this.currentPath = path;
    if (this.routes[path]) {
      this.routes[path]();
    } else {
      this.routes['dashboard']();
    }
    this.updateActiveLinks();
  }

  updateActiveLinks() {
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

const router = new Router();

// Layout Component
function renderLayout(content: string) {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = `
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

        <div id="view-content" class="flex-1 p-8">
          ${content}
        </div>
      </main>
    </div>
  `;

  createIcons({ icons });
}

// Chart Initialization
function initCharts() {
  const weightChartEl = document.getElementById('weight-chart');
  if (weightChartEl) {
    const width = weightChartEl.clientWidth;
    const height = weightChartEl.clientHeight;
    const data = [75, 72, 70, 65, 60, 58, 50];
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select('#weight-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (_, i) => x(i.toString())!)
      .attr('y', d => y(d))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin.bottom - y(d))
      .attr('fill', (_, i) => i === 5 ? '#006479' : '#adecff')
      .attr('rx', 8);
  }

  const fuelChartEl = document.getElementById('fuel-chart');
  if (fuelChartEl) {
    const width = fuelChartEl.clientWidth;
    const height = fuelChartEl.clientHeight;
    const radius = Math.min(width, height) / 2 - 10;
    const svg = d3.select('#fuel-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const arc = d3.arc()
      .innerRadius(radius - 10)
      .outerRadius(radius)
      .startAngle(0);

    svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .style('fill', '#adecff')
      .attr('d', arc as any);

    svg.append('path')
      .datum({ endAngle: 1.5 * Math.PI })
      .style('fill', '#006a35')
      .attr('d', arc as any);
      
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('class', 'font-headline font-bold text-2xl fill-on-surface')
      .text('1,620');
  }

  const trajectoryChartEl = document.getElementById('trajectory-chart');
  if (trajectoryChartEl) {
    const width = trajectoryChartEl.clientWidth;
    const height = trajectoryChartEl.clientHeight;
    const data = [85, 82, 84, 80, 78, 81, 76, 74, 77, 71, 73, 69];
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select('#trajectory-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (_, i) => x(i.toString())!)
      .attr('y', d => y(d))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin.bottom - y(d))
      .attr('fill', (_, i) => i === 7 ? '#006479' : '#00647922')
      .attr('rx', 4);
  }

  const quotaChartEl = document.getElementById('quota-chart');
  if (quotaChartEl) {
    const width = quotaChartEl.clientWidth;
    const height = quotaChartEl.clientHeight;
    const radius = Math.min(width, height) / 2 - 10;
    const svg = d3.select('#quota-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const arc = d3.arc()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .startAngle(0);

    svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .style('fill', '#adecff')
      .attr('d', arc as any);

    svg.append('path')
      .datum({ endAngle: 1.2 * Math.PI })
      .style('fill', '#006a35')
      .attr('d', arc as any);
      
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0em')
      .attr('class', 'font-headline font-bold text-3xl fill-on-surface')
      .text('1,840');
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em')
      .attr('class', 'text-[10px] font-bold uppercase tracking-widest fill-on-surface-variant')
      .text('kcal left');
  }
}

// Views
function DashboardView() {
  renderLayout(`
    <div class="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <section class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div class="md:col-span-8">
          <h1 class="text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-2">Precision <span class="text-secondary italic">Vitality.</span></h1>
          <p class="text-on-surface-variant font-medium text-lg mb-8 max-w-xl">Your biometrics are evolving. Today’s metrics suggest a 4% increase in metabolic efficiency since last Tuesday.</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-sm">
              <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest block mb-2">Active Days</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-bold text-primary">05</span>
                <span class="text-sm font-medium text-outline-variant">/ 07</span>
              </div>
            </div>
            <div class="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-secondary shadow-sm">
              <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest block mb-2">Calories Burned</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-bold text-secondary">2,840</span>
                <span class="text-xs font-medium text-outline-variant">kcal</span>
              </div>
            </div>
            <div class="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary-fixed shadow-sm">
              <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest block mb-2">Weight Lost</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-bold text-primary-dim">4.2</span>
                <span class="text-xs font-medium text-outline-variant">kg</span>
              </div>
            </div>
          </div>
        </div>
        <div class="md:col-span-4 bg-surface-container-low p-6 rounded-xl relative overflow-hidden h-full flex flex-col justify-between border border-outline-variant/10">
          <div>
            <p class="text-primary font-bold text-xl mb-1">Morning Session</p>
            <p class="text-on-surface-variant text-sm font-medium">Coming up in 45 minutes</p>
          </div>
          <div class="mt-6 flex items-center justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-outline-variant mb-1">Duration</p>
              <p class="font-bold text-lg">55 min</p>
            </div>
            <div class="h-8 w-px bg-outline-variant/20"></div>
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-outline-variant mb-1">Type</p>
              <p class="font-bold text-lg">HIIT</p>
            </div>
            <button class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <i data-lucide="play" class="fill-current"></i>
            </button>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm">
          <div class="flex items-center justify-between mb-10">
            <div>
              <h3 class="text-xl font-bold text-on-surface">Weight Loss Velocity</h3>
              <p class="text-on-surface-variant text-sm">Steady downward trend over 12 weeks</p>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-primary">1W</button>
              <button class="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold">1M</button>
              <button class="px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-primary">3M</button>
            </div>
          </div>
          <div id="weight-chart" class="h-64 w-full"></div>
        </div>
        <div class="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-sm">
          <h3 class="text-xl font-bold text-on-surface mb-2">Fueling Balance</h3>
          <p class="text-on-surface-variant text-sm mb-8">Daily Intake vs. Goal</p>
          <div id="fuel-chart" class="h-48 w-full flex items-center justify-center"></div>
          <div class="mt-8 space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-on-surface-variant">Intake Goal</span>
              <span class="font-bold">2,100 kcal</span>
            </div>
            <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div class="h-full bg-secondary w-3/4 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-xl font-bold text-on-surface">Weekly Evolution</h3>
            <span class="text-xs font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-tighter cursor-pointer">View Details</span>
          </div>
          <div class="space-y-6">
            <div class="group flex items-center justify-between p-4 rounded-xl hover:bg-surface-container transition-colors cursor-pointer">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <i data-lucide="zap"></i>
                </div>
                <div>
                  <p class="font-bold text-on-surface">Endurance Sprint</p>
                  <p class="text-xs text-on-surface-variant font-medium">Monday • 4.5 km • 32 min</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-secondary">+420 XP</p>
                <p class="text-[10px] uppercase font-bold text-outline-variant tracking-widest">Achieved</p>
              </div>
            </div>
            <div class="group flex items-center justify-between p-4 rounded-xl hover:bg-surface-container transition-colors cursor-pointer">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <i data-lucide="dumbbell"></i>
                </div>
                <div>
                  <p class="font-bold text-on-surface">Hypertrophy Upper B</p>
                  <p class="text-xs text-on-surface-variant font-medium">Wednesday • 45 min • 12 Sets</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-secondary">+580 XP</p>
                <p class="text-[10px] uppercase font-bold text-outline-variant tracking-widest">Achieved</p>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-4">
          <div class="bg-primary rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full group relative">
            <img src="https://picsum.photos/seed/gym/400/300" alt="Gym" class="w-full h-48 object-cover opacity-60 group-hover:scale-110 transition-transform duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>
            <div class="p-8 relative z-10 flex flex-col justify-between flex-1">
              <div>
                <span class="bg-secondary text-on-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2 block w-fit">Next Session</span>
                <h4 class="text-on-primary text-2xl font-bold">Dynamic Strength A</h4>
              </div>
              <div class="mt-8 space-y-4">
                <div class="flex items-start gap-4">
                  <i data-lucide="clock" class="text-primary-container"></i>
                  <div>
                    <p class="text-on-primary font-bold">Tomorrow, 07:30 AM</p>
                    <p class="text-on-primary/60 text-xs font-medium">Scheduled Duration: 60 min</p>
                  </div>
                </div>
              </div>
              <button class="mt-8 w-full py-4 bg-white text-primary rounded-xl font-black active:scale-95 transition-all shadow-xl">
                PREPARE WORKOUT
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `);
  initCharts();
}

function ExerciseLogView() {
  renderLayout(`
    <div class="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-4xl font-extrabold text-on-surface tracking-tight">Exercise Log</h2>
          <p class="text-on-surface-variant font-medium mt-1">Consistency is the bridge between goals and accomplishment.</p>
        </div>
        <button class="primary-gradient text-on-primary px-8 py-4 rounded-full font-extrabold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
          Log New Exercise
        </button>
      </div>

      <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-8 space-y-6">
          <div class="flex items-center gap-4">
            <span class="text-xs font-black uppercase tracking-widest text-outline">Today</span>
            <div class="h-[1px] flex-1 bg-outline-variant/20"></div>
          </div>
          
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm hover:border-primary/30 transition-all group">
            <div class="flex justify-between items-start mb-6">
              <div class="flex gap-4">
                <div class="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary">
                  <i data-lucide="dumbbell"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-on-surface">Hypertrophy Upper Body</h3>
                  <p class="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                    <i data-lucide="clock" class="w-3 h-3"></i> 08:30 AM • 72 mins
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-2xl font-black text-secondary">2,450 kg</span>
                <p class="text-[10px] font-bold uppercase text-outline tracking-tighter">Total Volume</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between p-4 rounded-lg bg-surface-container-low/50 group-hover:bg-surface-container-low transition-colors">
                <span class="font-bold">Barbell Bench Press</span>
                <span class="text-sm text-on-surface-variant">4 sets • 100kg x 8</span>
              </div>
              <div class="flex justify-between p-4 rounded-lg bg-surface-container-low/50 group-hover:bg-surface-container-low transition-colors">
                <span class="font-bold">Weighted Pull-ups</span>
                <span class="text-sm text-on-surface-variant">3 sets • BW+20kg x 6</span>
              </div>
              <div class="flex justify-between p-4 rounded-lg bg-surface-container-low/50 group-hover:bg-surface-container-low transition-colors">
                <span class="font-bold">Seated Dumbbell Press</span>
                <span class="text-sm text-on-surface-variant">3 sets • 32kg x 10</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 mt-8">
            <span class="text-xs font-black uppercase tracking-widest text-outline">Yesterday</span>
            <div class="h-[1px] flex-1 bg-outline-variant/20"></div>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm hover:border-primary/30 transition-all group">
            <div class="flex justify-between items-start mb-6">
              <div class="flex gap-4">
                <div class="w-12 h-12 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary">
                  <i data-lucide="zap"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-on-surface">Threshold Training</h3>
                  <p class="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                    <i data-lucide="calendar" class="w-3 h-3"></i> Oct 24 • 45 mins
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-2xl font-black text-tertiary">8.2 km</span>
                <p class="text-[10px] font-bold uppercase text-outline tracking-tighter">Distance Covered</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-surface-container-low/50 p-4 rounded-lg">
                <p class="text-[10px] font-bold uppercase text-outline mb-1">Avg Pace</p>
                <p class="text-lg font-bold">5'24"/km</p>
              </div>
              <div class="bg-surface-container-low/50 p-4 rounded-lg">
                <p class="text-[10px] font-bold uppercase text-outline mb-1">Avg HR</p>
                <p class="text-lg font-bold">158 bpm</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-4 space-y-6">
          <div class="bg-surface-container-low p-8 rounded-2xl relative overflow-hidden border border-outline-variant/10 shadow-sm">
            <div class="flex items-center justify-between mb-8">
              <h4 class="text-2xl font-extrabold text-primary">Personal Bests</h4>
              <i data-lucide="trophy" class="text-primary-fixed-dim fill-current"></i>
            </div>
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-1 bg-secondary rounded-full h-12"></div>
                <div class="flex-1">
                  <div class="flex justify-between items-baseline">
                    <span class="font-bold">Squat</span>
                    <span class="text-2xl font-black text-secondary">165kg</span>
                  </div>
                  <div class="flex justify-between items-center mt-1">
                    <span class="text-[10px] font-bold text-outline uppercase tracking-wider">Aug 12, 2023</span>
                    <span class="text-[10px] font-bold text-secondary-dim bg-secondary-container px-2 py-0.5 rounded-full">+5kg</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-1 bg-secondary rounded-full h-12"></div>
                <div class="flex-1">
                  <div class="flex justify-between items-baseline">
                    <span class="font-bold">Deadlift</span>
                    <span class="text-2xl font-black text-secondary">210kg</span>
                  </div>
                  <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Sep 30, 2023</p>
                </div>
              </div>
            </div>
            <div class="mt-10 p-4 bg-surface-container-highest/30 rounded-xl border border-primary/10">
              <h5 class="font-bold text-sm text-primary mb-2">Elite Progress Insight</h5>
              <p class="text-xs text-on-surface-variant leading-relaxed">You are in the top 5% of your age bracket for the deadlift. Continue focused posterior chain work.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
}

function NutritionView() {
  renderLayout(`
    <div class="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p class="text-sm font-bold text-primary uppercase tracking-widest mb-2">Performance Summary</p>
          <h2 class="text-5xl font-extrabold text-on-surface tracking-tight">Vitals & Fuel</h2>
        </div>
        <div class="bg-surface-container-low px-6 py-3 rounded-2xl flex items-center gap-3 border border-outline-variant/10 shadow-sm">
          <i data-lucide="calendar" class="text-primary"></i>
          <span class="font-bold text-on-surface">Oct 12 - Nov 11</span>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 space-y-8">
          <div class="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/15 shadow-sm">
            <div class="flex justify-between items-start mb-8">
              <div>
                <h3 class="text-2xl font-bold text-on-surface">Weight Trajectory</h3>
                <p class="text-on-surface-variant font-medium">Last 30 days performance</p>
              </div>
              <div class="text-right">
                <span class="text-4xl font-bold text-primary">184.2 <span class="text-sm font-normal text-on-surface-variant">lbs</span></span>
                <p class="text-secondary font-bold flex items-center justify-end gap-1">
                  <i data-lucide="trending-down" class="w-4 h-4"></i> 2.4 lbs
                </p>
              </div>
            </div>
            <div id="trajectory-chart" class="h-64 w-full"></div>
            <div class="flex justify-between mt-4 text-xs font-bold text-on-surface-variant/60">
              <span>OCT 12</span>
              <span>OCT 22</span>
              <span>NOV 01</span>
              <span>TODAY</span>
            </div>
          </div>

          <div class="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/15 shadow-sm">
            <h3 class="text-2xl font-bold mb-6 text-on-surface">Daily Log</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                <label class="block text-sm font-bold text-on-surface-variant">Current Weight (lbs)</label>
                <div class="relative">
                  <input type="text" placeholder="184.2" class="w-full bg-surface-container-lowest border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 text-xl font-bold">
                  <i data-lucide="scale" class="absolute right-4 top-1/2 -translate-y-1/2 text-primary"></i>
                </div>
              </div>
              <div class="space-y-4">
                <label class="block text-sm font-bold text-on-surface-variant">Body Fat (%)</label>
                <div class="relative">
                  <input type="text" placeholder="14.5" class="w-full bg-surface-container-lowest border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 text-xl font-bold">
                  <i data-lucide="activity" class="absolute right-4 top-1/2 -translate-y-1/2 text-primary"></i>
                </div>
              </div>
            </div>
            <button class="mt-8 w-full primary-gradient text-on-primary py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 transform active:scale-95 transition-all">Record Today's Progress</button>
          </div>
        </div>

        <aside class="lg:col-span-4 space-y-8">
          <div class="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/15 shadow-sm">
            <h3 class="text-2xl font-bold mb-8">Fuel Quota</h3>
            <div id="quota-chart" class="h-48 w-full flex items-center justify-center mb-8"></div>
            <div class="space-y-6">
              <div class="space-y-2">
                <div class="flex justify-between items-center text-sm font-bold">
                  <span>Protein</span>
                  <span class="text-on-surface-variant">142g / 180g</span>
                </div>
                <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full bg-primary" style="width: 78%"></div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between items-center text-sm font-bold">
                  <span>Carbs</span>
                  <span class="text-on-surface-variant">64g / 250g</span>
                </div>
                <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full bg-secondary" style="width: 25%"></div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between items-center text-sm font-bold">
                  <span>Fats</span>
                  <span class="text-on-surface-variant">32g / 70g</span>
                </div>
                <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full bg-primary-container" style="width: 45%"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="glass-panel p-8 rounded-3xl border border-white/20 shadow-lg">
            <h4 class="font-bold text-on-surface mb-4">Atelier Insight</h4>
            <p class="text-sm text-on-surface-variant leading-relaxed mb-6">
              Your protein intake is optimal for muscle preservation. Increase fiber-rich carbs by 15% this evening.
            </p>
            <div class="flex items-center gap-3">
              <i data-lucide="zap" class="text-secondary fill-current"></i>
              <span class="text-xs font-bold text-secondary uppercase tracking-tighter">Peak Performance Mode</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `);
  initCharts();
}

function WorkoutPlannerView() {
  renderLayout(`
    <div class="max-w-7xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <section class="flex flex-col md:flex-row justify-between items-end gap-6">
        <div class="space-y-2 max-w-xl">
          <h1 class="text-5xl font-extrabold tracking-tight text-on-surface leading-tight">Sculpt Your <span class="text-secondary italic">Performance.</span></h1>
          <p class="text-on-surface-variant text-lg">Schedule your routines and visualize your path to peak physical optimization.</p>
        </div>
        <div class="flex gap-3">
          <button class="flex items-center gap-2 px-6 py-3 bg-surface-container-low rounded-full font-bold text-primary hover:bg-surface-container transition-colors border border-outline-variant/10 shadow-sm">
            <i data-lucide="plus-circle"></i> New Routine
          </button>
          <button class="flex items-center gap-2 px-6 py-3 bg-surface-container-highest rounded-full font-bold text-primary hover:bg-primary hover:text-on-primary transition-all border border-outline-variant/10 shadow-sm">
            <i data-lucide="bookmark"></i> Library
          </button>
        </div>
      </section>

      <div class="grid grid-cols-12 gap-6 items-start">
        <div class="col-span-12 xl:col-span-8 space-y-6">
          <div class="bg-surface-container-low p-8 rounded-xxl border border-outline-variant/10 shadow-sm">
            <div class="flex justify-between items-center mb-8">
              <h3 class="text-2xl font-bold flex items-center gap-3">
                <i data-lucide="calendar" class="text-primary"></i> October 2023
              </h3>
              <div class="flex gap-2">
                <button class="p-2 bg-white rounded-full text-primary hover:bg-surface-container-high transition-colors shadow-sm"><i data-lucide="chevron-left"></i></button>
                <button class="p-2 bg-white rounded-full text-primary hover:bg-surface-container-high transition-colors shadow-sm"><i data-lucide="chevron-right"></i></button>
              </div>
            </div>
            <div class="grid grid-cols-7 gap-2 sm:gap-4">
              ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `
                <div class="text-center text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-widest py-2">${day}</div>
              `).join('')}
              ${Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                let baseClasses = "flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all shadow-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[80px]";
                let shapeClasses = "rounded-2xl sm:rounded-xl bg-surface-container-lowest";
                
                if (day === 2) shapeClasses = "rounded-2xl sm:rounded-xl bg-primary text-on-primary shadow-lg shadow-primary/20";
                if (day === 11) shapeClasses = "rounded-2xl sm:rounded-xl bg-secondary text-on-secondary shadow-lg shadow-secondary/20";
                
                return `
                  <div class="${baseClasses} ${shapeClasses}">
                    <span class="text-xs font-bold">${day}</span>
                    <div class="flex flex-col items-center gap-1">
                      ${day === 1 ? '<div class="h-1.5 w-1.5 bg-secondary rounded-full"></div>' : ''}
                      ${day === 2 ? '<i data-lucide="zap" class="w-3 h-3"></i>' : ''}
                      ${day === 4 ? '<div class="h-1 w-full bg-secondary-container rounded-full"></div>' : ''}
                      ${day === 6 ? '<div class="hidden sm:block p-1 bg-secondary-container rounded text-[8px] font-bold text-on-secondary-container truncate w-full text-center">Push Mastery</div><div class="sm:hidden h-1.5 w-1.5 bg-secondary-container rounded-full"></div>' : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="space-y-6">
            <h3 class="text-2xl font-bold tracking-tight">Saved Routines Library</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-surface-container-lowest p-6 rounded-xxl hover:scale-[1.02] transition-transform cursor-pointer group shadow-sm border border-outline-variant/10">
                <div class="flex justify-between items-start mb-6">
                  <div class="w-12 h-12 bg-primary-container/30 rounded-xl flex items-center justify-center text-primary">
                    <i data-lucide="dumbbell"></i>
                  </div>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary-container rounded-full">Hypertrophy</span>
                </div>
                <h4 class="text-xl font-bold mb-1">Peak Push Performance</h4>
                <div class="flex items-center gap-4 text-sm text-on-surface-variant mb-6">
                  <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> 55m</span>
                  <span class="flex items-center gap-1"><i data-lucide="target" class="w-3 h-3"></i> Chest, Tris</span>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-outline-variant/15">
                  <div class="flex -space-x-2">
                    <div class="w-6 h-6 rounded-full border-2 border-white bg-slate-300"></div>
                    <div class="w-6 h-6 rounded-full border-2 border-white bg-slate-400"></div>
                  </div>
                  <button class="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Add to Plan <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
                </div>
              </div>
              <div class="bg-surface-container-lowest p-6 rounded-xxl hover:scale-[1.02] transition-transform cursor-pointer group shadow-sm border border-outline-variant/10">
                <div class="flex justify-between items-start mb-6">
                  <div class="w-12 h-12 bg-secondary-container/30 rounded-xl flex items-center justify-center text-secondary">
                    <i data-lucide="zap"></i>
                  </div>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-secondary px-3 py-1 bg-secondary-container rounded-full">Conditioning</span>
                </div>
                <h4 class="text-xl font-bold mb-1">The Kinetic Flow</h4>
                <div class="flex items-center gap-4 text-sm text-on-surface-variant mb-6">
                  <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> 35m</span>
                  <span class="flex items-center gap-1"><i data-lucide="target" class="w-3 h-3"></i> Full Body</span>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-outline-variant/15">
                  <div class="flex -space-x-2">
                    <div class="w-6 h-6 rounded-full border-2 border-white bg-slate-300"></div>
                  </div>
                  <button class="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Add to Plan <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-12 xl:col-span-4 space-y-6">
          <div class="glass-panel p-8 rounded-xxl sticky top-24 border border-white/20 shadow-xl">
            <h3 class="text-2xl font-extrabold mb-6">Routine Builder</h3>
            <div class="bg-surface-container-lowest rounded-xl p-4 mb-6 ring-1 ring-outline-variant/10 shadow-sm">
              <p class="text-xs font-bold text-on-surface-variant mb-3 uppercase tracking-wider">Add Exercise</p>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-surface-container-high transition-colors cursor-grab">
                  <div class="flex items-center gap-3">
                    <i data-lucide="grip-vertical" class="text-outline-variant w-4 h-4"></i>
                    <p class="text-sm font-semibold">Barbell Back Squat</p>
                  </div>
                  <i data-lucide="plus" class="text-primary w-4 h-4"></i>
                </div>
                <div class="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-surface-container-high transition-colors cursor-grab">
                  <div class="flex items-center gap-3">
                    <i data-lucide="grip-vertical" class="text-outline-variant w-4 h-4"></i>
                    <p class="text-sm font-semibold">Dumbbell Lunges</p>
                  </div>
                  <i data-lucide="plus" class="text-primary w-4 h-4"></i>
                </div>
                <div class="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-surface-container-high transition-colors cursor-grab">
                  <div class="flex items-center gap-3">
                    <i data-lucide="grip-vertical" class="text-outline-variant w-4 h-4"></i>
                    <p class="text-sm font-semibold">Romanian Deadlift</p>
                  </div>
                  <i data-lucide="plus" class="text-primary w-4 h-4"></i>
                </div>
              </div>
            </div>
            <div class="border-2 border-dashed border-outline-variant/40 rounded-xxl p-6 min-h-[250px] flex flex-col items-center justify-center text-center">
              <div class="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                <i data-lucide="plus-square" class="text-primary w-8 h-8"></i>
              </div>
              <h4 class="font-bold text-lg mb-2">Build Your Session</h4>
              <p class="text-sm text-on-surface-variant max-w-[200px] leading-relaxed">Drag exercises here or use the add buttons to create a custom flow.</p>
            </div>
            <button class="w-full mt-8 py-4 primary-gradient text-on-primary rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-95 transition-transform">
              Save to Planner
            </button>
          </div>
        </div>
      </div>
    </div>
  `);
}

// Initialize Router
router.addRoute('dashboard', DashboardView);
router.addRoute('exercise-log', ExerciseLogView);
router.addRoute('nutrition', NutritionView);
router.addRoute('workout-planner', WorkoutPlannerView);

router.handleRoute();
