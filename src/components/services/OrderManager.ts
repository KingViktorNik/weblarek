import { IOrderRequest, ISubmitAndGetIdTotal } from "../../types";
import { CURRENCY } from "../../utils/constants";
import { Customer } from "../models/Customer";
import { ShoppingCart } from "../models/ShoppingCart";
import { SuccessForm } from "../views/forms/SuccessForm";
import { Header } from "../views/Header";
import { Modal } from "../views/Modal";
import { ApiService } from "./ApiService";

/**
 * Класс, управляющий процессом оформления и отправки заказа.
 * Обеспечивает:
 * - формирование данных заказа на основе информации о клиенте и содержимом корзины;
 * - отправку заказа через API;
 * - обработку успешного завершения заказа (показ модального окна с подтверждением,
 *   очистку корзины и данных клиента, обновление счётчика в шапке);
 * - обработку ошибок при отправке заказа.
 */
export class OrderManager {
    /**
   * Создаёт экземпляр менеджера заказов.
   *
   * @param apiService - сервис для взаимодействия с API (отправка заказа)
   * @param customer - экземпляр модели клиента (хранит данные покупателя)
   * @param shoppingCart - экземпляр модели корзины покупок (хранит список товаров)
   * @param modal - компонент модального окна
   * @param successForm - компонент формы успеха (отображает сообщение о завершении заказа)
   * @param header - компонент шапки приложения (для обновления счётчика товаров)
   */
  constructor(
    private apiService: ApiService,
    private customer: Customer,
    private shoppingCart: ShoppingCart,
    private modal: Modal,
    private successForm: SuccessForm,
    private header: Header
  ) {}

  /**
   * Формирует объект запроса на заказ на основе данных клиента и содержимого корзины.
   *
   * @returns Объект запроса на заказ, содержащий:
   * - данные клиента (имя, email, телефон и т.д.);
   * - массив идентификаторов товаров в заказе;
   * - общую стоимость заказа.
   */
  private createOrderRequest(): IOrderRequest {
    return {
      ...this.customer.getData(),
      items: this.shoppingCart.getList().map(item => item.id),
      total: this.shoppingCart.getTotalPrice(),
    };
  }

  /**
   * Отправляет заказ через API.
   * При успешном выполнении вызывает `handleSuccess`, при ошибке — `handleError`.
   */
  async submitOrder(): Promise<void> {
    const orderRequest = this.createOrderRequest();

    try {
      const order = await this.apiService.sendOrder(orderRequest);
      this.handleSuccess(order);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Обрабатывает успешный ответ от API после отправки заказа.
   *
   * Логика:
   * - открывает модальное окно с формой успеха, отображая сумму списания;
   * - очищает корзину покупок;
   * - сбрасывает данные клиента;
   * - обнуляет счётчик товаров в шапке.
   *
   * @param order - ответ от API с данными о заказе (включая итоговую сумму)
   */
  private handleSuccess(order: ISubmitAndGetIdTotal): void {
    this.modal.open(
      this.successForm.render({
        description: `Списано ${order.total} ${CURRENCY}`
      })
    );

    this.shoppingCart.clear();
    this.customer.clearData();
    this.header.counterClear();
  }

  /**
   * Обрабатывает ошибку, возникшую при отправке заказа.
   * Выводит ошибку в консоль для отладки.
   *
   * @param error - объект ошибки, возникшей при отправке заказа
   */
  private handleError(error: Error): void {
    console.error('Ошибка отправки заказа:', error);
  }
}
