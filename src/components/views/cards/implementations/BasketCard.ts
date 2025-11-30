import { ICardActions, TSequentialProduct } from "../../../../types";
import { ensureElement } from "../../../../utils/utils";
import { Card } from "../abstract/Card";

/**
 * Компонент карточки товара в корзине (BasketCard), расширяющий базовый класс Card.
 * Добавляет:
 * - порядковый номер товара в корзине;
 * - кнопку удаления товара из корзины.
 * 
 * Предназначен для отображения товаров в составе корзины покупок.
 * 
 * @extends Card
 */
export class BasketCard extends Card {
  /**
   * Элемент DOM, отображающий порядковый номер товара в корзине.
   * Соответствует селектору `.basket__item-index` внутри контейнера компонента.
   */
  private basketItemIndexElement: HTMLElement;

    /**
   * Элемент DOM — кнопка удаления товара из корзины.
   * Соответствует селектору `.basket__item-delete` внутри контейнера компонента.
   */
  private basketItemDeleteElement: HTMLButtonElement;

  /**
   * Создаёт экземпляр компонента BasketCard.
   * 
   * @param container - корневой элемент DOM, в котором размещается компонент
   * @param actions - объект с действиями для карточки (опционально),
   *                  в частности, обработчик клика `onClick` для кнопки удаления
   */
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    // Получаем элементы DOM для порядкового номера и кнопки удаления
    this.basketItemIndexElement = ensureElement(
      this.container.querySelector('.basket__item-index') as HTMLElement, 
      this.container
    );

    this.basketItemDeleteElement = ensureElement(
      this.container.querySelector('.basket__item-delete') as HTMLButtonElement, 
      this.container
    );
    
    // Если передан обработчик клика, привязываем его к кнопке удаления
    if (actions?.onClick) {
      this.basketItemDeleteElement.addEventListener('click', actions.onClick);
    }
  }

    /**
   * Отрисовывает компонент с переданными данными о товаре в корзине.
   * 
   * @param data - частично заполненные данные о товаре в корзине (опционально)
   * @returns Отрисованный элемент DOM компонента
   */
  render(data?: Partial<TSequentialProduct>): HTMLElement {
    // Отображение порядкового номера товара в корзине
    if (this.basketItemIndexElement && data?.itemIndex) {
      this.basketItemIndexElement.textContent = data.itemIndex;
    }

    return super.render(data);
  }
  
}