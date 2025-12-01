import { ICardActions } from "../../../../types";
import { ensureElement } from "../../../../utils/utils";
import { Card } from "../abstract/Card";

/**
 * Компонент карточки товара в корзине.
 *
 * Расширяет базовую карточку товара (`Card`), добавляя:
 * - порядковый номер позиции в корзине;
 * - кнопку удаления товара из корзины;
 * - обработку клика по кнопке удаления.
*/
export class BasketCard extends Card {
  private index: HTMLElement;
  private itemDeleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    this.index = ensureElement('.basket__item-index', this.container);
    this.itemDeleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    
    if (actions?.onClick) {
      this.itemDeleteButton.addEventListener('click', actions.onClick);
    }
  }

  set indexElement (index: number) {
    this.index.textContent = index.toString();
  }
  
}