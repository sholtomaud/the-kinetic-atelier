import { BaseComponent } from '@/core/BaseComponent';
import * as d3 from 'd3';

export class DashboardView extends BaseComponent {
  protected render() {
    return `
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
    `;
  }

  afterRender() {
    this.initCharts();
  }

  private initCharts() {
    const weightChartEl = this.querySelector('#weight-chart') as HTMLElement;
    if (weightChartEl) {
      const width = weightChartEl.clientWidth;
      const height = weightChartEl.clientHeight || 256;
      const data = [75, 72, 70, 65, 60, 58, 50];
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };

      const svg = d3.select(weightChartEl)
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

    const fuelChartEl = this.querySelector('#fuel-chart') as HTMLElement;
    if (fuelChartEl) {
      const width = fuelChartEl.clientWidth;
      const height = fuelChartEl.clientHeight || 192;
      const radius = Math.min(width, height) / 2 - 10;
      const svg = d3.select(fuelChartEl)
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
  }
}

customElements.define('dashboard-view', DashboardView);
