import { TProductUrlButtonText } from "../../../../types";
import { EventTopic } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { ProductCard } from "./ProductCard";

/**
 * Компонент предпросмотра карточки товара (PreviewCard), расширяющий ProductCard.
 * Добавляет:
 * - текстовое описание товара;
 * - кнопку действия с динамическим текстом и управлением активностью;
 * - обработку клика по кнопке для отправки события о выборе товара.
 *
 * Используется для детального отображения товара перед покупкой.
 *
 * @extends ProductCard
 */
export class PreviewCard extends ProductCard {
  /**
   * Элемент DOM — кнопка действия в карточке товара.
   * Соответствует селектору `.card__button` внутри контейнера компонента.
   */  
  private cardButtonElement: HTMLButtonElement;

  /**
   * Элемент DOM — текстовое описание товара.
   * Соответствует селектору `.card__text` внутри контейнера компонента.
   */  
  private cardTextElement: HTMLElement;

  /**
   * Создаёт экземпляр компонента PreviewCard.
   *
   * @param event - экземпляр системы событий для коммуникации между компонентами
   * @param container - корневой элемент DOM, в котором размещается компонент
   */  
  constructor(private event: IEvents, private container: HTMLElement) {
    super(container);
    
    // Получаем элементы DOM для кнопки и текста описания
    this.cardButtonElement = ensureElement(
      this.container.querySelector('.card__button') as HTMLButtonElement,
      this.container
    );

    this.cardTextElement = ensureElement(
      this.container.querySelector('.card__text') as HTMLElement,
      this.container
    );

    // При клике на кнопку генерируем событие отправки товара
    this.cardButtonElement.addEventListener('click', () => {
        this.event.emit(EventTopic.PRODUCT_SUBMIT);
    }) 
  }
  
   /**
   * Устанавливает состояние активности кнопки в зависимости от наличия цены.
   * Если статус (цена) передан и имеет значение, кнопка активируется.
   * В противном случае — блокируется.
   *
   * @param status - значение цены товара (число) или null/undefined, если цена отсутствует
   */
  updateButtonState(status: number | null | undefined): void {
    this.cardButtonElement.disabled = true;
    
    if (status) {
      this.cardButtonElement.disabled = false;
    }
  }

  /**
   * Отрисовывает компонент с переданными данными о товаре.
   *
   * @param data - частично заполненные данные о товаре (опционально)
   * @returns Отрисованный элемент DOM компонента
   */ 
  render(data?: Partial<TProductUrlButtonText>): HTMLElement {
    // Отображение описания товара
    if (this.cardTextElement && data?.description) {
      this.cardTextElement.textContent = data.description;
    }

    if (this.cardButtonElement && data?.buttonTextContent) {
      this.cardButtonElement.textContent = data.buttonTextContent;
    }
    return super.render(data);
  }

}
