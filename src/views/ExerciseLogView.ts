import { BaseComponent } from '@/core/BaseComponent';
import { store } from '@/core/Store';
import '@/components/LogExerciseModal';

export class ExerciseLogView extends BaseComponent {
  private unsubscribe: (() => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => this.renderComponent(true));
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }

  protected render() {
    const workouts = [...store.getState().workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Simple PR Calculation (Highest volume or weight recorded in an exercise)
    const prs: Record<string, { weight: number, date: string }> = {};
    store.getState().workouts.forEach(w => {
        w.exercises.forEach(ex => {
            // Check if there are sets with weight
            const maxWeight = ex.sets.reduce((max, s) => Math.max(max, s.weight), 0);
            if (maxWeight > 0) {
                if (!prs[ex.name] || prs[ex.name].weight < maxWeight) {
                    prs[ex.name] = { weight: maxWeight, date: w.date };
                }
            }
        });
    });

    return `
      <div class="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div class="flex justify-between items-end">
          <div>
            <h2 class="text-4xl font-extrabold text-on-surface tracking-tight">Exercise Log</h2>
            <p class="text-on-surface-variant font-medium mt-1">Consistency is the bridge between goals and accomplishment.</p>
          </div>
          <button id="open-log-modal" class="primary-gradient text-on-primary px-8 py-4 rounded-full font-extrabold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
            Log New Exercise
          </button>
        </div>

        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-12 lg:col-span-8 space-y-6">
            ${workouts.length === 0 ? `
                <div class="bg-surface-container-low p-12 rounded-3xl text-center border-2 border-dashed border-outline-variant/20">
                    <i data-lucide="dumbbell" class="w-16 h-16 text-outline-variant mx-auto mb-4 opacity-20"></i>
                    <p class="text-on-surface-variant font-bold">No sessions logged yet. Your kinetic journey begins with the first rep.</p>
                </div>
            ` : workouts.map((w, i) => {
              const showDateLabel = i === 0 || new Date(w.date).toDateString() !== new Date(workouts[i-1].date).toDateString();
              const dateObj = new Date(w.date);
              const isToday = dateObj.toDateString() === new Date().toDateString();
              const isYesterday = dateObj.toDateString() === new Date(Date.now() - 86400000).toDateString();

              let dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              if (isToday) dateLabel = 'Today';
              if (isYesterday) dateLabel = 'Yesterday';

              return `
                ${showDateLabel ? `
                  <div class="flex items-center gap-4 ${i > 0 ? 'mt-8' : ''}">
                    <span class="text-xs font-black uppercase tracking-widest text-outline">${dateLabel}</span>
                    <div class="h-[1px] flex-1 bg-outline-variant/20"></div>
                  </div>
                ` : ''}
                <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm hover:border-primary/30 transition-all group">
                  <div class="flex justify-between items-start mb-6">
                    <div class="flex gap-4">
                      <div class="w-12 h-12 rounded-xl ${w.type === 'Strength' ? 'bg-secondary-container text-secondary' : 'bg-tertiary-container text-tertiary'} flex items-center justify-center">
                        <i data-lucide="${w.type === 'Strength' ? 'dumbbell' : 'zap'}"></i>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-on-surface">${w.title}</h3>
                        <p class="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                          <i data-lucide="clock" class="w-3 h-3"></i> ${new Date(w.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${w.duration} mins
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="text-2xl font-black ${w.type === 'Strength' ? 'text-secondary' : 'text-tertiary'}">${w.volume > 0 ? w.volume + ' kg' : (w.duration * 8) + ' XP'}</span>
                      <p class="text-[10px] font-bold uppercase text-outline tracking-tighter">${w.volume > 0 ? 'Total Volume' : 'Performance XP'}</p>
                    </div>
                  </div>
                  <div class="space-y-3">
                    ${w.exercises.map(ex => `
                        <div class="flex justify-between p-4 rounded-lg bg-surface-container-low/50 group-hover:bg-surface-container-low transition-colors">
                            <span class="font-bold">${ex.name}</span>
                            <span class="text-sm text-on-surface-variant">${ex.sets.length > 0 ? `${ex.sets.length} sets • ${ex.sets[0].weight}kg x ${ex.sets[0].reps}` : ''}</span>
                        </div>
                    `).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="col-span-12 lg:col-span-4 space-y-6">
            <div class="bg-surface-container-low p-8 rounded-2xl relative overflow-hidden border border-outline-variant/10 shadow-sm">
              <div class="flex items-center justify-between mb-8">
                <h4 class="text-2xl font-extrabold text-primary">Personal Bests</h4>
                <i data-lucide="trophy" class="text-primary-fixed-dim fill-current"></i>
              </div>
              <div class="space-y-6">
                ${Object.entries(prs).length > 0 ? Object.entries(prs).map(([name, data]) => `
                    <div class="flex items-center gap-4">
                      <div class="w-1 bg-secondary rounded-full h-12"></div>
                      <div class="flex-1">
                        <div class="flex justify-between items-baseline">
                          <span class="font-bold">${name}</span>
                          <span class="text-2xl font-black text-secondary">${data.weight}kg</span>
                        </div>
                        <div class="flex justify-between items-center mt-1">
                          <span class="text-[10px] font-bold text-outline uppercase tracking-wider">${new Date(data.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                `).join('') : `
                    <p class="text-sm text-on-surface-variant italic">Start training to record your first PRs.</p>
                `}
              </div>
              <div class="mt-10 p-4 bg-surface-container-highest/30 rounded-xl border border-primary/10">
                <h5 class="font-bold text-sm text-primary mb-2">Elite Progress Insight</h5>
                <p class="text-xs text-on-surface-variant leading-relaxed">Consistency is key. You've logged ${workouts.length} sessions. Keep pushing your limits.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  afterRender() {
    this.querySelector('#open-log-modal')?.addEventListener('click', () => {
      document.body.appendChild(document.createElement('log-exercise-modal'));
    });
  }
}

customElements.define('exercise-log-view', ExerciseLogView);
