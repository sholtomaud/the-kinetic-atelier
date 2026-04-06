import { BaseComponent } from '@/core/BaseComponent';
import { store, Workout } from '@/core/Store';

export class LogExerciseModal extends BaseComponent {
  protected render() {
    return `
      <div id="modal-overlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div class="bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <header class="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
            <h2 class="text-3xl font-extrabold text-on-surface tracking-tight">Log <span class="text-primary italic">Session</span></h2>
            <button id="close-modal" class="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
              <i data-lucide="x"></i>
            </button>
          </header>

          <form id="log-form" class="p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-outline ml-1">Routine Title</label>
                <input type="text" name="title" required placeholder="e.g. Upper Body Power"
                  class="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 font-bold">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-outline ml-1">Type</label>
                <select name="type" class="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 font-bold appearance-none">
                  <option value="Strength">Strength</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Conditioning">Conditioning</option>
                  <option value="Endurance">Endurance</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-outline ml-1">Duration (min)</label>
                <input type="number" name="duration" required placeholder="45"
                  class="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 font-bold">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-outline ml-1">Total Volume (kg)</label>
                <input type="number" name="volume" placeholder="0"
                  class="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 font-bold">
              </div>
            </div>

            <div class="pt-4 border-t border-outline-variant/10">
              <p class="text-xs font-bold uppercase tracking-widest text-outline mb-4 ml-1">Exercises Summary</p>
              <textarea name="exercises" rows="3" placeholder="List exercises (e.g. Bench Press: 3x10)"
                class="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 font-medium"></textarea>
            </div>

            <button type="submit" class="w-full primary-gradient text-on-primary py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[0.98] transition-transform active:scale-95 mt-4">
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

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const newWorkout: Workout = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        title: formData.get('title') as string,
        type: formData.get('type') as any,
        duration: Number(formData.get('duration')),
        volume: Number(formData.get('volume')) || 0,
        exercises: (formData.get('exercises') as string).split('\n').filter(line => line.trim()).map(line => ({
          name: line.trim(),
          sets: [] // Simple version for now
        }))
      };

      store.addWorkout(newWorkout);
      close();
    });
  }
}

customElements.define('log-exercise-modal', LogExerciseModal);
