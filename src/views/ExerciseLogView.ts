import { BaseComponent } from '@/core/BaseComponent';

export class ExerciseLogView extends BaseComponent {
  protected render() {
    return `
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
    `;
  }
}

customElements.define('exercise-log-view', ExerciseLogView);
