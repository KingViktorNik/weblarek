import { EventTopic } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/** Интерфейс, описывающий данные для компонента Modal */
interface IModal {
  content: HTMLElement;
}

/** Компонент модального окна (Modal) */
export class Modal extends Component<IModal> {
  private closeButtonElement: HTMLButtonElement;
  private content: HTMLElement;

  constructor(private event: IEvents, container: HTMLElement) {
    super(container);

    this.content = ensureElement('.modal__content', this.container);
    this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButtonElement.addEventListener('click', () =>
      this.event.emit(EventTopic.MODAL_CLOSE)
    );

    this.container.addEventListener('click', event => {
      if(event.target === event.currentTarget) {
        this.event.emit(EventTopic.MODAL_CLOSE);
      }
    });
  }

  open(content: HTMLElement): void {
    this.content.replaceChildren(content)
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.content.replaceChildren();
    this.container.classList.remove('modal_active');
  }

}