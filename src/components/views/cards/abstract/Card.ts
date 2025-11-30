import { IProduct } from "../../../../types";
import { CURRENCY, PRICE_UNAVAILABLE } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { Component } from "../../../base/Component";

/**
 * Абстрактный базовый класс для компонентов карточек товаров (Card).
 * Обеспечивает унифицированное отображение основной информации о товаре:
 * - название;
 * - цена с валютой.
 *
 * Предназначен для наследования конкретными реализациями карточек (например, для каталога, корзины и т.д.).
 *
 * @extends Component<IProduct>
 */
export abstract class Card extends Component<IProduct> {
    /**
   * Элемент DOM, отображающий название товара.
   * Соответствует селектору `.card__title` внутри контейнера компонента.
   */
  protected titleElement: HTMLElement;
  
  /**
   * Элемент DOM, отображающий цену товара с валютой.
   * Соответствует селектору `.card__price` внутри контейнера компонента.
   */
  protected priceElement: HTMLElement;

    /**
   * Создаёт экземпляр компонента Card.
   *
   * @param container - корневой элемент DOM, в котором размещается компонент
   */
  constructor(container: HTMLElement) {
    super(container);

    // Получаем элементы DOM для отображения названия и цены
    this.titleElement = ensureElement(
      this.container.querySelector('.card__title') as HTMLElement, 
      this.container
    );
    this.priceElement = ensureElement(
      this.container.querySelector('.card__price') as HTMLElement,
      this.container
    );
  }
  
    /**
   * Отрисовывает компонент с переданными данными о товаре.
   *
   * @param data - частично заполненные данные о товаре (опционально)
   * @returns Отрисованный элемент DOM компонента
   */
  render(data?: Partial<IProduct>): HTMLElement {
    
    if (this.titleElement && data?.title) {
      this.titleElement.textContent = data.title;
    }

    if (this.priceElement && data?.price) {
      this.priceElement.textContent = `${data.price} ${CURRENCY}`;
    } else {
      this.priceElement.textContent = PRICE_UNAVAILABLE;
    }

    return super.render(data);
  }
  
}
