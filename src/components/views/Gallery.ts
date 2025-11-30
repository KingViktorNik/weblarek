import { IProductDOMList} from '../../types';
import { Component } from '../base/Component';

/**
 * Компонент галереи товаров (Gallery), предназначенный для отображения списка товаров.
 * Обеспечивает замену содержимого контейнера на переданный список DOM‑элементов товаров.
 *
 * @extends Component<IProductList>
 */
export class Gallery extends Component<IProductDOMList> {
  /**
   * Создаёт экземпляр компонента Gallery.
   *
   * @param container - корневой элемент DOM, в котором размещается компонент
   */
  constructor(container: HTMLElement) {
    super(container);
  }

  /**
   * Отрисовывает компонент с переданными данными о списке товаров.
   *
   * @param data - частично заполненные данные о галерее товаров (опционально),
   *              должны содержать массив `productList` с DOM‑элементами товаров
   * @returns Корневой элемент DOM компонента (container)
   *
   * @throws Ошибка, если `data` не определено или `data.productList` отсутствует.
   *         В текущей реализации исключение не обрабатывается — предполагается,
   *         что данные всегда корректны.
   */
  render(data?: Partial<IProductDOMList> | undefined): HTMLElement {
    
    if (this.container && Array.isArray(data?.productItems)) {
      this.container.replaceChildren(...data.productItems);
    }

    return this.container;
  }
    
}