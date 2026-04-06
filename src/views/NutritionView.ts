import { BaseComponent } from '@/core/BaseComponent';
import * as d3 from 'd3';
import { store } from '@/core/Store';

export class NutritionView extends BaseComponent {
  private unsubscribe: (() => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => this.renderComponent(true));
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }

  protected render() {
    const state = store.getState();
    const nutrition = state.nutrition;
    const goals = state.user.goals;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = nutrition.find(n => n.date === todayStr);

    const currentWeight = todayLog ? todayLog.weight : (nutrition.length > 0 ? nutrition[nutrition.length - 1].weight : 180);
    const lastWeight = nutrition.length > 1 ? nutrition[nutrition.length - 2].weight : currentWeight;
    const weightDiff = currentWeight - lastWeight;

    return `
      <div class="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p class="text-sm font-bold text-primary uppercase tracking-widest mb-2">Performance Summary</p>
            <h2 class="text-5xl font-extrabold text-on-surface tracking-tight">Vitals & Fuel</h2>
          </div>
          <div class="bg-surface-container-low px-6 py-3 rounded-2xl flex items-center gap-3 border border-outline-variant/10 shadow-sm">
            <i data-lucide="calendar" class="text-primary"></i>
            <span class="font-bold text-on-surface">Last 30 Days</span>
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
                  <span class="text-4xl font-bold text-primary">${currentWeight.toFixed(1)} <span class="text-sm font-normal text-on-surface-variant">lbs</span></span>
                  <p class="${weightDiff <= 0 ? 'text-secondary' : 'text-error'} font-bold flex items-center justify-end gap-1">
                    <i data-lucide="${weightDiff <= 0 ? 'trending-down' : 'trending-up'}" class="w-4 h-4"></i> ${Math.abs(weightDiff).toFixed(1)} lbs
                  </p>
                </div>
              </div>
              <div id="trajectory-chart" class="h-64 w-full"></div>
              <div class="flex justify-between mt-4 text-xs font-bold text-on-surface-variant/60">
                <span>30D AGO</span>
                <span>15D AGO</span>
                <span>TODAY</span>
              </div>
            </div>

            <div class="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/15 shadow-sm">
              <h3 class="text-2xl font-bold mb-6 text-on-surface">Daily Log</h3>
              <form id="biometric-form" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <label class="block text-sm font-bold text-on-surface-variant">Current Weight (lbs)</label>
                  <div class="relative">
                    <input type="number" step="0.1" name="weight" value="${currentWeight}" placeholder="184.2" class="w-full bg-surface-container-lowest border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 text-xl font-bold">
                    <i data-lucide="scale" class="absolute right-4 top-1/2 -translate-y-1/2 text-primary"></i>
                  </div>
                </div>
                <div class="space-y-4">
                  <label class="block text-sm font-bold text-on-surface-variant">Body Fat (%)</label>
                  <div class="relative">
                    <input type="number" step="0.1" name="bodyFat" value="${todayLog ? todayLog.bodyFat : 15}" placeholder="14.5" class="w-full bg-surface-container-lowest border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 text-xl font-bold">
                    <i data-lucide="activity" class="absolute right-4 top-1/2 -translate-y-1/2 text-primary"></i>
                  </div>
                </div>
                <button type="submit" class="md:col-span-2 primary-gradient text-on-primary py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 transform active:scale-95 transition-all">Record Today's Progress</button>
              </form>
            </div>
          </div>

          <aside class="lg:col-span-4 space-y-8">
            <div class="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/15 shadow-sm">
              <h3 class="text-2xl font-bold mb-8">Fuel Quota</h3>
              <div id="quota-chart" class="h-48 w-full flex items-center justify-center mb-10"></div>
              <div class="grid grid-cols-3 gap-4">
                ${['Protein', 'Carbs', 'Fats'].map(macro => {
                  const key = macro[0].toLowerCase() as 'p' | 'c' | 'f';
                  const consumed = todayLog ? todayLog.macrosConsumed[key] : 0;
                  return `
                    <div class="flex flex-col items-center gap-3">
                      <div id="${macro.toLowerCase()}-chart" class="w-16 h-16"></div>
                      <div class="text-center">
                        <p class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">${macro}</p>
                        <p class="text-xs font-bold text-on-surface">${consumed}g</p>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            <div class="glass-panel p-8 rounded-3xl border border-white/20 shadow-lg">
              <h4 class="font-bold text-on-surface mb-4">Atelier Insight</h4>
              <p class="text-sm text-on-surface-variant leading-relaxed mb-6">
                ${todayLog && todayLog.macrosConsumed.p < goals.macros.p * 0.8
                  ? 'Your protein intake is low today. Consider a shake to support muscle preservation.'
                  : 'Your macronutrient distribution is optimal for your current goals.'}
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
    const form = this.querySelector('#biometric-form') as HTMLFormElement;
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const todayStr = new Date().toISOString().split('T')[0];
      store.updateNutrition(todayStr, {
        weight: Number(formData.get('weight')),
        bodyFat: Number(formData.get('bodyFat')),
      });
    });
  }

  private initCharts() {
    const state = store.getState();
    const trajectoryChartEl = this.querySelector('#trajectory-chart') as HTMLElement;
    if (trajectoryChartEl) {
      trajectoryChartEl.innerHTML = '';
      const width = trajectoryChartEl.clientWidth;
      const height = trajectoryChartEl.clientHeight || 256;

      const last30Logs = [...state.nutrition]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-12);

      const data = last30Logs.length > 1 ? last30Logs.map(n => ({ date: n.date, weight: n.weight })) : [
        { date: '1', weight: 85 }, { date: '2', weight: 82 }, { date: '3', weight: 84 },
        { date: '4', weight: 80 }, { date: '5', weight: 78 }, { date: '6', weight: 81 },
        { date: '7', weight: 76 }, { date: '8', weight: 74 }, { date: '9', weight: 77 },
        { date: '10', weight: 71 }, { date: '11', weight: 73 }, { date: '12', weight: 69 }
      ];
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };

      const svg = d3.select(trajectoryChartEl)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      const x = d3.scalePoint()
        .domain(data.map((_, i) => i.toString()))
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.weight)! - 2, d3.max(data, d => d.weight)! + 2])
        .range([height - margin.bottom, margin.top]);

      const area = d3.area<any>()
        .x((_, i) => x(i.toString())!)
        .y0(height - margin.bottom)
        .y1(d => y(d.weight))
        .curve(d3.curveMonotoneX);

      const line = d3.line<any>()
        .x((_, i) => x(i.toString())!)
        .y(d => y(d.weight))
        .curve(d3.curveMonotoneX);

      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'weight-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop').attr('offset', '0%').attr('stop-color', '#006479').attr('stop-opacity', 0.3);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', '#006479').attr('stop-opacity', 0);

      svg.append('path')
        .datum(data)
        .attr('fill', 'url(#weight-gradient)')
        .attr('d', area);

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#006479')
        .attr('stroke-width', 3)
        .attr('d', line);

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (_, i) => x(i.toString())!)
        .attr('cy', d => y(d.weight))
        .attr('r', 4)
        .attr('fill', '#fff')
        .attr('stroke', '#006479')
        .attr('stroke-width', 2);
    }

    const renderCircularProgress = (selector: string, percentage: number, color: string, value: string, label?: string) => {
      const el = this.querySelector(selector) as HTMLElement;
      if (!el) return;
      el.innerHTML = '';
      const width = el.clientWidth;
      const height = el.clientHeight;
      const radius = Math.min(width, height) / 2;

      const svg = d3.select(el)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      const arc = d3.arc()
        .innerRadius(radius - 6)
        .outerRadius(radius)
        .startAngle(0);

      svg.append('path')
        .datum({ endAngle: 2 * Math.PI })
        .style('fill', '#e0f3f7')
        .attr('d', arc as any);

      svg.append('path')
        .datum({ endAngle: 2 * Math.PI * Math.min(percentage, 1) })
        .style('fill', color)
        .attr('d', arc as any);

      if (label) {
        svg.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0em')
          .attr('class', 'font-bold text-xl fill-on-surface')
          .text(value);
        svg.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '1.5em')
          .attr('class', 'text-[8px] font-black uppercase tracking-tighter fill-on-surface-variant')
          .text(label);
      } else {
        svg.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('class', 'font-bold text-xs fill-on-surface')
          .text(Math.round(percentage * 100) + '%');
      }
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = state.nutrition.find(n => n.date === todayStr);

    const quotaChartEl = this.querySelector('#quota-chart') as HTMLElement;
    if (quotaChartEl) {
      const consumed = todayLog ? todayLog.caloriesConsumed : 0;
      const goal = state.user.goals.dailyCalories;
      renderCircularProgress('#quota-chart', consumed / goal, '#006a35', consumed.toLocaleString(), 'kcal consumed');
    }

    ['protein', 'carbs', 'fats'].forEach(macro => {
      const key = macro[0] as 'p' | 'c' | 'f';
      const consumed = todayLog ? todayLog.macrosConsumed[key] : 0;
      const goal = state.user.goals.macros[key];
      const color = macro === 'protein' ? '#006479' : (macro === 'carbs' ? '#006a35' : '#4a6367');
      renderCircularProgress(`#${macro}-chart`, consumed / goal, color, consumed.toString(), `${goal}g`);
    });
  }
}

customElements.define('nutrition-view', NutritionView);
