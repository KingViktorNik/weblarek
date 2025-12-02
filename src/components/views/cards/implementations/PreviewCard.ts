import { EventTopic } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { ProductCard } from "./ProductCard";

/** Интерфейс данных предпросмотра карточки товара */
interface IPreviewCard {
  description:string,
  isButtonEnabled: boolean,
  textButton: string
}
/**
 * Компонент предпросмотра карточки товара.
 *
 * Расширяет `ProductCard`, добавляя:
 * - кнопку действия (например, «В корзину»);
 * - текстовое описание товара;
 * - логику управления состоянием кнопки в зависимости от цены.
 */
export class PreviewCard extends ProductCard implements IPreviewCard {
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

  set isButtonEnabled (enabled: boolean) {
      this.cardButton.disabled = !enabled;
  }

  set textButton (text: string) {
    this.cardButton.textContent = text;
  }

}