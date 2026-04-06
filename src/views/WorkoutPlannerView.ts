import { BaseComponent } from '@/core/BaseComponent';

export class WorkoutPlannerView extends BaseComponent {
  protected render() {
    return `
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
                  const baseClasses = "flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all shadow-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[80px]";
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
    `;
  }
}

customElements.define('workout-planner-view', WorkoutPlannerView);
