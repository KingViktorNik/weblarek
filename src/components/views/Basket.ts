import { IProductDOMList, TBasketListAndOrderTotal } from "../../types";
import { CURRENCY, EventTopic } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * Компонент корзины покупок (Basket), отображающий:
 * - список товаров в корзине;
 * - общую стоимость заказа;
 * - кнопку оформления заказа.
 * 
 * Обеспечивает:
 * - обновление списка товаров;
 * - отображение итоговой суммы;
 * - управление активностью кнопки оформления заказа;
 * - отправку события открытия формы заказа.
 * 
 * @extends Component<IBasket>
 */
export class Basket extends Component<IProductDOMList> {
  /**
   * Элемент DOM, содержащий список товаров в корзине.
   * Соответствует селектору `.basket__list` внутри контейнера компонента.
   */
  private basketListElement: HTMLElement;
  
  /**
   * Элемент DOM — кнопка оформления заказа.
   * Соответствует селектору `.basket__button` внутри контейнера компонента.
   */
  private basketButtonElement: HTMLButtonElement;
  
  /**
   * Элемент DOM, отображающий общую стоимость заказа.
   * Соответствует селектору `.basket__price` внутри контейнера компонента.
   */
  private basketPriceElement: HTMLElement;
  
  /**
   * Создаёт экземпляр компонента Basket.
   * 
   * @param events - экземпляр системы событий для коммуникации между компонентами
   * @param container - корневой элемент DOM, в котором размещается компонент
   */
  constructor(private events: IEvents, container: HTMLElement) {
    super(container);

    // Получаем элементы DOM для списка товаров, кнопки и цены
    this.basketListElement = ensureElement(
      this.container.querySelector('.basket__list') as HTMLButtonElement, 
      this.container
    );
    this.basketButtonElement = ensureElement(
      this.container.querySelector('.basket__button') as HTMLButtonElement, 
      this.container
    );
    this.basketPriceElement = ensureElement(
      this.container.querySelector('.basket__price') as HTMLElement,
      this.container
    );

    // При клике на кнопку оформления заказа генерируем событие открытия формы
    this.basketButtonElement.addEventListener('click', () => {
      this.events.emit(EventTopic.ORDER_FORM_OPEN);
    })

  }

  /**
   * Активирует кнопку оформления заказа.
   */
  basketButtonEnable() {
    this.basketButtonElement.disabled = false;
  }

  /**
   * Деактивирует кнопку оформления заказа.
   */
  basketButtonDisable() {
    this.basketButtonElement.disabled = true;
  }

  /**
   * Отрисовывает компонент с переданными данными о корзине.
   * 
   * @param data - частично заполненные данные о корзине (опционально),
   *              могут содержать:
   *              - `productItems` — список DOM‑элементов товаров в корзине;
   *              - `orderTotal` — итоговая сумма заказа
   * @returns Отрисованный элемент DOM компонента (container)
   */
  render(data?: Partial<TBasketListAndOrderTotal>): HTMLElement {
    
    // Обновление списка товаров в корзине
    if (this.basketButtonElement && data?.productItems) {
      this.basketListElement.replaceChildren(...data.productItems);
    }

    // Отображение итоговой стоимости заказа
    if (this.basketPriceElement) {
      data?.orderTotal
        ? this.basketPriceElement.textContent = `${data.orderTotal} ${CURRENCY}`
        : this.basketPriceElement.textContent = `${0} ${CURRENCY}`;
    } 

    return super.render(data);
  }
}