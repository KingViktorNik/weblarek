import { IProduct } from "../../types";
import { CURRENCY, EventTopic } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/** Интерфейс данных корзины
 *  Описывает структуру данных, которыми оперирует компонент `Basket`
 *  Расширяет `IProduct` частично (только необходимые поля)
 */
interface IBasket extends Partial<IProduct> {
  listProduct: HTMLElement[],
  isOrderButtonDisabled: boolean,
  priceTotal: number
}

/** Компонент корзины покупок */
export class Basket extends Component<IBasket> {
  private listElement: HTMLElement;
  private priceElement: HTMLElement;
  private buttonElement: HTMLButtonElement;

  constructor(private events: IEvents, container: HTMLElement) {
    super(container);

    this.listElement = ensureElement('.basket__list', this.container);
    this.priceElement = ensureElement('.basket__price', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      this.events.emit(EventTopic.ORDER_FORM_OPEN);
    })

    this.buttonElement.disabled = true;
  }

  // Управляет активностью кнопки оформления заказа.
  set isOrderButtonDisabled( value: boolean) {
    this.buttonElement.disabled = value;
  }

  set listProduct (list: HTMLElement []) {
    this.listElement.replaceChildren(...list);
  }

  set priceTotal (price: number) {
    if (price) {
      this.priceElement.textContent = `${price} ${CURRENCY}`
    } else {
      this.priceElement.textContent = `${0} ${CURRENCY}`;
    }
  }

}