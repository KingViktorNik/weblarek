import { IProduct } from '../../types';
import { Component } from '../base/Component';

/** Интерфейс данных галереи товаров */
interface IGallery {
  productList: IProduct[];
}

/* Компонент галереи товаров.
 *
 * Обеспечивает отображение списка товаров в виде галереи.
 * Позволяет динамически обновлять содержимое галереи через сеттер. */
export class Gallery extends Component<IGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set productList(productList: HTMLElement[]) {
    this.container.replaceChildren(...productList);
  }
    
}