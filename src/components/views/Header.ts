import { EventTopic } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/** Интерфейс данных шапки сайта */
interface IHeader {
  counter: number;
}

/** Компонент шапки сайта с кнопкой корзины и счётчиком товаров */
export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(private events: IEvents, container: HTMLElement) {
    super(container);
    
    this.counterElement = ensureElement('.header__basket-counter', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this.basketButton.addEventListener('click', () => {
        this.events.emit(EventTopic.BASKET_OPEN);
    })
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }

}