import { ICardActions } from "../../../../types";
import { categoryMap } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { Card } from "../abstract/Card";

/** Тип ключа категории товара, соответствующий ключам объекта categoryMap. */
type CategoryKey = keyof typeof categoryMap;

/**
 * Компонент карточки товара для отображения в каталоге.
 *
 * Расширяет базовую карточку (`Card`), добавляя:
 * - категорию товара с визуальной маркировкой;
 * - изображение товара;
 * - обработку клика по всей карточке.
 */
export class ProductCard extends Card {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;

  constructor(protected container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    this.categoryElement = ensureElement('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set category (category: string) {
    const categoryKey = category as CategoryKey;
    const categoryName = categoryMap[categoryKey] || 'unknown';

    this.categoryElement.textContent = category;
    this.categoryElement.classList = '';
    this.categoryElement.classList.add('card__category', categoryName);
  }

  set image (imageSrc: string) {
      this.setImage(this.imageElement, imageSrc, this.title);
  }

}
