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
    if (this.dataset.rendered) return;
    this.innerHTML = this.render();
    this.renderIcons();
    this.afterRender();
    this.dataset.rendered = 'true';
  }

  protected renderIcons() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createIcons({ icons: icons as any });
  }

  protected afterRender() {}
}
