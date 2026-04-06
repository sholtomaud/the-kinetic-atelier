import { BaseComponent } from '@/core/BaseComponent';
import { store, Workout } from '@/core/Store';

export class LogExerciseModal extends BaseComponent {
  private workoutTitle: string = '';
  private workoutType: string = 'Strength';
  private workoutDuration: number = 45;
  private exercises: Array<{ name: string; sets: Array<{ reps: number; weight: number }> }> = [
    { name: '', sets: [{ reps: 0, weight: 0 }] }
  ];

  protected render() {
    return `
      <div id="modal-overlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div class="bg-surface-container-lowest w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
          <header class="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low shrink-0">
            <h2 class="text-3xl font-extrabold text-on-surface tracking-tight">Log <span class="text-primary italic">Session</span></h2>
            <button id="close-modal" class="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
              <i data-lucide="x"></i>
            </button>
          </header>

          <form id="log-form" class="p-8 space-y-6 overflow-y-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-outline ml-1">Routine Title</label>
                <input type="text" id="workout-title" name="title" value="${this.workoutTitle}" required placeholder="e.g. Upper Body Power"
                  class="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 font-bold">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-outline ml-1">Type</label>
                <select id="workout-type" name="type" class="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 font-bold appearance-none">
                  <option value="Strength" ${this.workoutType === 'Strength' ? 'selected' : ''}>Strength</option>
                  <option value="HIIT" ${this.workoutType === 'HIIT' ? 'selected' : ''}>HIIT</option>
                  <option value="Conditioning" ${this.workoutType === 'Conditioning' ? 'selected' : ''}>Conditioning</option>
                  <option value="Endurance" ${this.workoutType === 'Endurance' ? 'selected' : ''}>Endurance</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-outline ml-1">Duration (min)</label>
                <input type="number" id="workout-duration" name="duration" value="${this.workoutDuration}" required placeholder="45"
                  class="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 font-bold">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-outline ml-1">Total Volume (kg)</label>
                <input type="number" id="total-volume" name="volume" placeholder="0" readonly
                  class="w-full bg-surface-container-low/50 border-none rounded-2xl p-4 font-bold cursor-not-allowed">
              </div>
            </div>

            <div class="pt-4 border-t border-outline-variant/10">
              <div class="flex justify-between items-center mb-4">
                <p class="text-xs font-bold uppercase tracking-widest text-outline ml-1">Exercises</p>
                <button type="button" id="add-exercise" class="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i> Add Exercise
                </button>
              </div>

              <div id="exercises-container" class="space-y-6">
                ${this.exercises.map((ex, exIdx) => `
                  <div class="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10 space-y-4">
                    <div class="flex justify-between items-center">
                        <input type="text" placeholder="Exercise Name" value="${ex.name}" data-ex-idx="${exIdx}" class="exercise-name bg-transparent border-none p-0 text-lg font-bold focus:ring-0 placeholder:text-outline-variant w-full">
                        <button type="button" class="remove-exercise text-outline-variant hover:text-error" data-ex-idx="${exIdx}">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <div class="space-y-2">
                        ${ex.sets.map((set, setIdx) => `
                            <div class="grid grid-cols-12 gap-3 items-center">
                                <span class="col-span-1 text-[10px] font-black text-outline-variant">${setIdx + 1}</span>
                                <div class="col-span-5 flex items-center bg-surface-container-lowest rounded-xl px-3 py-2">
                                    <input type="number" placeholder="0" value="${set.weight}" data-ex-idx="${exIdx}" data-set-idx="${setIdx}" class="set-weight bg-transparent border-none p-0 w-full text-right font-bold focus:ring-0">
                                    <span class="text-[10px] font-bold text-outline-variant ml-1">KG</span>
                                </div>
                                <div class="col-span-5 flex items-center bg-surface-container-lowest rounded-xl px-3 py-2">
                                    <input type="number" placeholder="0" value="${set.reps}" data-ex-idx="${exIdx}" data-set-idx="${setIdx}" class="set-reps bg-transparent border-none p-0 w-full text-right font-bold focus:ring-0">
                                    <span class="text-[10px] font-bold text-outline-variant ml-1">REPS</span>
                                </div>
                                <button type="button" class="col-span-1 remove-set text-outline-variant hover:text-error text-right" data-ex-idx="${exIdx}" data-set-idx="${setIdx}">
                                    <i data-lucide="minus-circle" class="w-3 h-3"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="add-set text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline pt-2" data-ex-idx="${exIdx}">
                        <i data-lucide="plus" class="w-3 h-3"></i> Add Set
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            <button type="submit" class="w-full primary-gradient text-on-primary py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[0.98] transition-transform active:scale-95 mt-4 shrink-0">
              Commit Session to Atelier
            </button>
          </form>
        </div>
      </div>
    `;
  }

  afterRender() {
    const form = this.querySelector('#log-form') as HTMLFormElement;
    const closeBtn = this.querySelector('#close-modal');
    const overlay = this.querySelector('#modal-overlay');

    const close = () => {
      this.remove();
    };

    closeBtn?.addEventListener('click', close);
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    this.querySelector('#workout-title')?.addEventListener('change', (e: any) => {
        this.workoutTitle = e.target.value;
    });

    this.querySelector('#workout-type')?.addEventListener('change', (e: any) => {
        this.workoutType = e.target.value;
    });

    this.querySelector('#workout-duration')?.addEventListener('change', (e: any) => {
        this.workoutDuration = Number(e.target.value);
    });

    this.querySelector('#add-exercise')?.addEventListener('click', () => {
        this.exercises.push({ name: '', sets: [{ reps: 0, weight: 0 }] });
        this.renderComponent(true);
    });

    this.querySelectorAll('.remove-exercise').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.getAttribute('data-ex-idx'));
            this.exercises.splice(idx, 1);
            this.renderComponent(true);
        });
    });

    this.querySelectorAll('.add-set').forEach(btn => {
        btn.addEventListener('click', () => {
            const exIdx = Number(btn.getAttribute('data-ex-idx'));
            this.exercises[exIdx].sets.push({ reps: 0, weight: 0 });
            this.renderComponent(true);
        });
    });

    this.querySelectorAll('.remove-set').forEach(btn => {
        btn.addEventListener('click', () => {
            const exIdx = Number(btn.getAttribute('data-ex-idx'));
            const setIdx = Number(btn.getAttribute('data-set-idx'));
            this.exercises[exIdx].sets.splice(setIdx, 1);
            this.renderComponent(true);
        });
    });

    this.querySelectorAll('.exercise-name').forEach(input => {
        input.addEventListener('change', (e: any) => {
            const exIdx = Number(input.getAttribute('data-ex-idx'));
            this.exercises[exIdx].name = e.target.value;
        });
    });

    this.querySelectorAll('.set-weight').forEach(input => {
        input.addEventListener('change', (e: any) => {
            const exIdx = Number(input.getAttribute('data-ex-idx'));
            const setIdx = Number(input.getAttribute('data-set-idx'));
            this.exercises[exIdx].sets[setIdx].weight = Number(e.target.value);
            this.updateTotalVolume();
        });
    });

    this.querySelectorAll('.set-reps').forEach(input => {
        input.addEventListener('change', (e: any) => {
            const exIdx = Number(input.getAttribute('data-ex-idx'));
            const setIdx = Number(input.getAttribute('data-set-idx'));
            this.exercises[exIdx].sets[setIdx].reps = Number(e.target.value);
            this.updateTotalVolume();
        });
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const newWorkout: Workout = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        title: formData.get('title') as string,
        type: formData.get('type') as any,
        duration: Number(formData.get('duration')),
        volume: this.calculateTotalVolume(),
        exercises: this.exercises.filter(ex => ex.name.trim()).map(ex => ({
            name: ex.name,
            sets: ex.sets.map(s => ({ reps: s.reps, weight: s.weight }))
        }))
      };

      store.addWorkout(newWorkout);
      close();
    });

    this.updateTotalVolume();
  }

  private calculateTotalVolume(): number {
    return this.exercises.reduce((total, ex) => {
        return total + ex.sets.reduce((exTotal, set) => exTotal + (set.reps * set.weight), 0);
    }, 0);
  }

  private updateTotalVolume() {
    const volumeEl = this.querySelector('#total-volume') as HTMLInputElement;
    if (volumeEl) {
        volumeEl.value = this.calculateTotalVolume().toString();
    }
  }
}

customElements.define('log-exercise-modal', LogExerciseModal);
