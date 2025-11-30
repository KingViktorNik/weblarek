// Класс ShoppingCart отвечает за управление корзиной покупок.
// Хранит список товаров, выбранных пользователем для покупки, и предоставляет методы
// для работы с корзиной.

import { IProduct } from "../../types";
import { EventTopic } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class ShoppingCart {
  // Массив товаров, добавленных в корзину.
  private productList: IProduct[] = [];


  constructor(private events: IEvents) {
    this.events = events;
  }

  /**
   * @returns {IProduct[]} - Возвращает все товары, находящиеся в корзине.
   */
  getList(): IProduct[] {
    return this.productList;
  }

  //
  /**
   * Добавляет переданный товар в массив.
   * Если товар уже есть в корзине, не добавляет дубликат.
   * @param product - товар
   */
  add(product: IProduct): void {
    if (!this.hasProduct(product.id)) {
      this.productList.push(product);
      this.events.emit(EventTopic.BASKET_LIST_UPDATE);
    }
  }

  /**
   * Удаляет переданный товар из массива.
   * @param product - товар
   */
  remove(product: IProduct): void {
    const index = this.productList.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.productList.splice(index, 1);
      this.events.emit(EventTopic.BASKET_LIST_UPDATE);
    }
  }

  /**
   * Очищает корзину, удаляя все товары из массива items.
   */
  clear(): void {
    this.productList = [];
    this.events.emit(EventTopic.BASKET_LIST_UPDATE);
  }

  /**
   * Считает и возвращает сумму цен всех товаров в корзине.
   * Товары с значением null не учитываются.
   * @returns {number} - Общая стоимость товаров в корзине.
   */
  getTotalPrice(): number {
    return this.productList.reduce((total, item) => {
      return item.price !== null ? total + item.price : total;
    }, 0);
  }

  /**
   * @returns {number} Возвращает число товаров, находящихся в корзине.
   */
  getProductCount(): number {
    return this.productList.length;
  }

  /**
   * Проверяет наличие товара в корзине по его идентификатору.
   * @param {string} id - идентификатор товара
   * @returns {boolean} Возвращает true, если товар с указанным id есть в корзине; false — если нет.
   */
  hasProduct(id: string): boolean {
    return this.productList.some(item => item.id === id);
  }
}