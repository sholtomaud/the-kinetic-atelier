import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseComponent } from '../BaseComponent';

class TestComponent extends BaseComponent {
  protected render() {
    return `<div id="test"><i data-lucide="dumbbell"></i></div>`;
  }
}

customElements.define('test-component', TestComponent);

describe('BaseComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the content', () => {
    const el = document.createElement('test-component') as TestComponent;
    document.body.appendChild(el);
    expect(el.querySelector('#test')).not.toBeNull();
  });

  it('calls afterRender after initial render', () => {
    class AfterRenderComponent extends BaseComponent {
      afterRender = vi.fn();
      protected render() { return ''; }
    }
    customElements.define('after-render-component', AfterRenderComponent);
    const el = document.createElement('after-render-component') as AfterRenderComponent;
    document.body.appendChild(el);
    expect(el.afterRender).toHaveBeenCalled();
  });
});
