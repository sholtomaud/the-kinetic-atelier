import { BaseComponent } from '@/core/BaseComponent';
import * as d3 from 'd3';

export class NutritionView extends BaseComponent {
  protected render() {
    return `
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
    `;
  }

  afterRender() {
    this.initCharts();
  }

  private initCharts() {
    const trajectoryChartEl = this.querySelector('#trajectory-chart') as HTMLElement;
    if (trajectoryChartEl) {
      const width = trajectoryChartEl.clientWidth;
      const height = trajectoryChartEl.clientHeight || 256;
      const data = [85, 82, 84, 80, 78, 81, 76, 74, 77, 71, 73, 69];
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };

      const svg = d3.select(trajectoryChartEl)
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

    const quotaChartEl = this.querySelector('#quota-chart') as HTMLElement;
    if (quotaChartEl) {
      const width = quotaChartEl.clientWidth;
      const height = quotaChartEl.clientHeight || 192;
      const radius = Math.min(width, height) / 2 - 10;
      const svg = d3.select(quotaChartEl)
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
}

customElements.define('nutrition-view', NutritionView);
