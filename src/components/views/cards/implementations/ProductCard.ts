import { ICardActions, TProductUrlButtonText } from "../../../../types";
import { categoryMap } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { Card } from "../abstract/Card";

/**
 * Тип ключа категории товара, соответствующий ключам объекта categoryMap.
 */
type CategoryKey = keyof typeof categoryMap;

/**
 * Компонент карточки товара (ProductCard), расширяющий базовый класс Card.
 * Добавляет отображение:
 * - категории товара;
 * - изображения товара.
 * 
 * Поддерживает обработку клика по карточке через переданные действия.
 * 
 * @extends Card
 */
export class ProductCard extends Card {
    /**
   * Элемент DOM, отображающий категорию товара.
   * Соответствует селектору `.card__category` внутри контейнера компонента.
   */
  protected cardCategoryElement: HTMLElement;

  /**
   * Элемент DOM для отображения изображения товара.
   * Соответствует селектору `.card__image` внутри контейнера компонента.
   */
  protected cardImageElement: HTMLImageElement;

    /**
   * Создаёт экземпляр компонента ProductCard.
   * 
   * @param container - корневой элемент DOM, в котором размещается компонент
   * @param actions - объект с действиями для карточки (опционально), 
   *                  в частности, обработчик клика `onClick`
   */
  constructor(private container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    // Получаем элементы DOM для категории и изображения
    this.cardCategoryElement = ensureElement(
      this.container.querySelector('.card__category') as HTMLElement, 
      this.container
    );
    
    this.cardImageElement = ensureElement(
      this.container.querySelector('.card__image') as HTMLImageElement, 
      this.container
    );

    // Если передан обработчик клика, привязываем его к контейнеру карточки
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  /**
   * Отрисовывает компонент с переданными данными о товаре.
   * 
   * @param data - частично заполненные данные о товаре (опционально)
   * @returns Отрисованный элемент DOM компонента
   */
  render(data?: Partial<TProductUrlButtonText>): HTMLElement {
    // Отображение категории
    if (this.cardCategoryElement && data?.category) {
      const categoryKey = data.category as CategoryKey;
      const categoryName = categoryMap[categoryKey] || 'unknown';

      this.cardCategoryElement.textContent = data.category;
      this.cardCategoryElement.classList.add(categoryName);
    }

    // Отображение изображения
    if (this.cardImageElement && data?.image && data.imageUrl) {
      const imageSrc = data.imageUrl + data.image;
      this.setImage(this.cardImageElement, imageSrc, data.title);
    }

    return super.render(data);
  }

}
