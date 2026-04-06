import { createIcons, icons } from 'lucide';

export abstract class BaseComponent extends HTMLElement {
  protected abstract render(): string;

  constructor() {
    super();
  }

  connectedCallback() {
    this.update();
  }

  protected update() {
    const content = this.render();
    // Don't overwrite if it already has the same content to avoid losing children (like in layout)
    const temp = document.createElement('div');
    temp.innerHTML = content;

    // Simple check: if we have a lot of content already and we are about to put a template with a specific placeholder
    if (this.innerHTML.length > 0 && content.includes('id="layout-content"')) {
        // We probably don't want to overwrite everything if we are AppLayout and already rendered
        return;
    }

    this.innerHTML = content;
    this.renderIcons();
    this.afterRender();
  }

  protected renderIcons() {
    createIcons({ icons });
  }

  protected afterRender() {}
}
