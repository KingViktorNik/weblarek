import { EventTopic } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { ProductCard } from "./ProductCard";

/**
 * Компонент предпросмотра карточки товара.
 *
 * Расширяет `ProductCard`, добавляя:
 * - кнопку действия (например, «В корзину»);
 * - текстовое описание товара;
 * - логику управления состоянием кнопки в зависимости от цены.
 */
export class PreviewCard extends ProductCard {
  private cardButton: HTMLButtonElement;
  private cardText: HTMLElement;

  constructor(protected event: IEvents, container: HTMLElement) {
    super(container);
    
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.cardText = ensureElement('.card__text', this.container);

    this.cardButton.addEventListener('click', () => {
        this.event.emit(EventTopic.PRODUCT_SUBMIT);
    }) 
 }

  set description (cardDescription: string) {
    this.cardText.textContent = cardDescription;
  }

  set price (price: number | null) {
    if (price) {
      this.cardButton.disabled = false;
    } else {
      this.cardButton.disabled = true;
    }
  }

  set textButton (text: string) {
    this.cardButton.textContent = text;
  }

}