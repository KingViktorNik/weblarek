import { IProduct } from "../../../../types";
import { CURRENCY, PRICE_UNAVAILABLE } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { Component } from "../../../base/Component";

/** Абстрактный базовый класс для отображения карточки товара. */
export abstract class Card extends Component<IProduct> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(protected container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement('.card__title', this.container);
    this.priceElement = ensureElement('.card__price', this.container);
  }
  
  set title (title:string | '') {
    this.titleElement.textContent = title;
  }

  set price (price: number | null) {
    price
      ? this.priceElement.textContent = `${price} ${CURRENCY}`
      : this.priceElement.textContent = PRICE_UNAVAILABLE;
  }
  
}
