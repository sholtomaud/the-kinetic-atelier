import { BaseComponent } from '@/core/BaseComponent';
import { store, Routine } from '@/core/Store';

export class WorkoutPlannerView extends BaseComponent {
  private currentMonth = new Date().getMonth();
  private currentYear = new Date().getFullYear();
  private unsubscribe: (() => void) | null = null;
  private selectedExercises: string[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => this.renderComponent(true));
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }

  protected render() {
    const state = store.getState();
    const workouts = state.workouts;
    const routines = state.routines;

    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    // Adjust for Monday start (0=Sun, 1=Mon... -> 0=Mon, 6=Sun)
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const monthName = new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });

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
                  <i data-lucide="calendar" class="text-primary"></i> ${monthName} ${this.currentYear}
                </h3>
                <div class="flex gap-2">
                  <button id="prev-month" class="p-2 bg-white rounded-full text-primary hover:bg-surface-container-high transition-colors shadow-sm"><i data-lucide="chevron-left"></i></button>
                  <button id="next-month" class="p-2 bg-white rounded-full text-primary hover:bg-surface-container-high transition-colors shadow-sm"><i data-lucide="chevron-right"></i></button>
                </div>
              </div>
              <div class="grid grid-cols-7 gap-2 sm:gap-4">
                ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `
                  <div class="text-center text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-widest py-2">${day}</div>
                `).join('')}

                ${Array.from({ length: startOffset }).map(() => `<div></div>`).join('')}

                ${Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateStr = new Date(this.currentYear, this.currentMonth, day).toDateString();
                  const hasWorkout = workouts.some(w => new Date(w.date).toDateString() === dateStr);
                  const isToday = new Date().toDateString() === dateStr;

                  const baseClasses = "flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all shadow-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[80px]";
                  let shapeClasses = isToday
                    ? "rounded-2xl sm:rounded-xl bg-primary text-on-primary shadow-lg shadow-primary/20"
                    : "rounded-2xl sm:rounded-xl bg-surface-container-lowest";

                  return `
                    <div class="${baseClasses} ${shapeClasses}">
                      <span class="text-xs font-bold">${day}</span>
                      <div class="flex flex-col items-center gap-1">
                        ${hasWorkout ? '<i data-lucide="zap" class="w-3 h-3 text-secondary"></i>' : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <div class="space-y-6">
              <h3 class="text-2xl font-bold tracking-tight">Saved Routines Library</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${routines.map(r => `
                    <div class="bg-surface-container-lowest p-6 rounded-xxl hover:scale-[1.02] transition-transform cursor-pointer group shadow-sm border border-outline-variant/10">
                      <div class="flex justify-between items-start mb-6">
                        <div class="w-12 h-12 bg-primary-container/30 rounded-xl flex items-center justify-center text-primary">
                          <i data-lucide="${r.type === 'Hypertrophy' ? 'dumbbell' : 'zap'}"></i>
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary-container rounded-full">${r.type}</span>
                      </div>
                      <h4 class="text-xl font-bold mb-1">${r.name}</h4>
                      <div class="flex items-center gap-4 text-sm text-on-surface-variant mb-6">
                        <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${r.duration}m</span>
                        <span class="flex items-center gap-1"><i data-lucide="target" class="w-3 h-3"></i> ${r.target}</span>
                      </div>
                      <div class="flex items-center justify-between pt-4 border-t border-outline-variant/15">
                        <div class="flex -space-x-2">
                          <div class="w-6 h-6 rounded-full border-2 border-white bg-slate-300"></div>
                        </div>
                        <button class="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Add to Plan <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
                      </div>
                    </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="col-span-12 xl:col-span-4 space-y-6">
            <div class="glass-panel p-8 rounded-xxl sticky top-24 border border-white/20 shadow-xl">
              <h3 class="text-2xl font-extrabold mb-6">Routine Builder</h3>
              <div class="bg-surface-container-lowest rounded-xl p-4 mb-6 ring-1 ring-outline-variant/10 shadow-sm">
                <p class="text-xs font-bold text-on-surface-variant mb-3 uppercase tracking-wider">Available Exercises</p>
                <div class="space-y-3">
                  ${['Barbell Back Squat', 'Dumbbell Lunges', 'Romanian Deadlift', 'Bench Press', 'Pull-ups'].map(ex => `
                      <div draggable="true" data-exercise="${ex}" class="exercise-item flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-surface-container-high transition-colors cursor-grab">
                        <div class="flex items-center gap-3">
                          <i data-lucide="grip-vertical" class="text-outline-variant w-4 h-4"></i>
                          <p class="text-sm font-semibold">${ex}</p>
                        </div>
                        <button class="add-ex-btn text-primary" data-exercise="${ex}"><i data-lucide="plus" class="w-4 h-4"></i></button>
                      </div>
                  `).join('')}
                </div>
              </div>
              <div id="drop-zone" class="border-2 border-dashed border-outline-variant/40 rounded-xxl p-6 min-h-[250px] flex flex-col items-center justify-center text-center transition-colors">
                ${this.selectedExercises.length === 0 ? `
                    <div class="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                      <i data-lucide="plus-square" class="text-primary w-8 h-8"></i>
                    </div>
                    <h4 class="font-bold text-lg mb-2">Build Your Session</h4>
                    <p class="text-sm text-on-surface-variant max-w-[200px] leading-relaxed">Drag exercises here or use the add buttons to create a custom flow.</p>
                ` : `
                    <div class="w-full space-y-2">
                        ${this.selectedExercises.map((ex, idx) => `
                            <div class="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg shadow-sm">
                                <span class="text-sm font-bold">${ex}</span>
                                <button class="remove-ex-btn text-error" data-index="${idx}"><i data-lucide="trash" class="w-4 h-4"></i></button>
                            </div>
                        `).join('')}
                    </div>
                `}
              </div>
              <button id="save-routine" class="w-full mt-8 py-4 primary-gradient text-on-primary rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-95 transition-transform disabled:opacity-50" ${this.selectedExercises.length === 0 ? 'disabled' : ''}>
                Save to Library
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  afterRender() {
    this.querySelector('#prev-month')?.addEventListener('click', () => {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderComponent(true);
    });

    this.querySelector('#next-month')?.addEventListener('click', () => {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.renderComponent(true);
    });

    // Drag & Drop
    const exerciseItems = this.querySelectorAll('.exercise-item');
    exerciseItems.forEach(item => {
        item.addEventListener('dragstart', (e: any) => {
            e.dataTransfer.setData('text/plain', item.getAttribute('data-exercise'));
        });
    });

    const dropZone = this.querySelector('#drop-zone') as HTMLElement;
    dropZone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-primary', 'bg-primary/5');
    });

    dropZone?.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-primary', 'bg-primary/5');
    });

    dropZone?.addEventListener('drop', (e: any) => {
        e.preventDefault();
        dropZone.classList.remove('border-primary', 'bg-primary/5');
        const exercise = e.dataTransfer.getData('text/plain');
        if (exercise) {
            this.selectedExercises.push(exercise);
            this.renderComponent(true);
        }
    });

    this.querySelectorAll('.add-ex-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const ex = btn.getAttribute('data-exercise');
            if (ex) {
                this.selectedExercises.push(ex);
                this.renderComponent(true);
            }
        });
    });

    this.querySelectorAll('.remove-ex-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.getAttribute('data-index'));
            this.selectedExercises.splice(idx, 1);
            this.renderComponent(true);
        });
    });

    this.querySelector('#save-routine')?.addEventListener('click', () => {
        const name = prompt('Enter routine name:', 'My Custom Routine');
        if (name) {
            const newRoutine: Routine = {
                id: crypto.randomUUID(),
                name,
                type: 'Custom',
                target: 'Various',
                duration: this.selectedExercises.length * 10,
                exercises: [...this.selectedExercises]
            };
            store.saveRoutine(newRoutine);
            this.selectedExercises = [];
            alert('Routine saved to library!');
        }
    });
  }
}

customElements.define('workout-planner-view', WorkoutPlannerView);
