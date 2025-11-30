// Класс ProductCatalog отвечает за хранение и управление каталогом товаров.
// Содержит полный список доступных товаров и текущий выбранный товар для детального просмотра.

import { IProduct } from "../../types";
import { EventTopic } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class ProductCatalog {
  // Предназначен для хранения скписка товара.
  private productList: IProduct[] = [];
  //Текущий выбранный товар для отображения в модальном окне (может быть null, 
  // если товар не выбран).
  private selectedProduct: IProduct | null = null;

  constructor(private events: IEvents) {
    this.events = events;
  }

  /**
   * @param {IProduct[]} productList Сохраняет переданный массив товаров.
   */
  setProductList(productList: IProduct[]): void {
    this.productList = productList;
    this.events.emit(EventTopic.PRODUCT_RECEIVED, productList);
  }
  
  /**
   * Возвращает полный список товаров из каталога.
   * @returns {Object[]} IProduct[] - Возвращает массив товаров
   */
  getProductList(): IProduct[] {
    return this.productList;
  }

  /**
   * Находит и возвращает товар по его уникальному идентификатору.
   * @param {string} id - идентификатор товара.
   * @returns {IProduct} Возвращает товар типа IProduct или undefined, если товар не найден.
   */
  getProductById(id: string): IProduct | undefined {
    return this.productList.find(product => product.id === id);
  }

  /**
   * Сохраняет переданный товар для детального отображения.
   * @param {IProduct} product - выбранный товар.
   */
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit(EventTopic.PRODUCT_SELECTED, this.selectedProduct);
  }

  /**
   * Возвращает товар, выбранный для подробного просмотра.
   * @returns {IProduct} - Возвращает текущий выбранный товар (IProduct) или null
   */
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}