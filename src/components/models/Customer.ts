//  Класс Customer хранит и управляет данными покупателя, необходимыми для оформления заказа.
// Обеспечивает валидацию данных перед отправкой на сервер.

import { ICustomer, TPayment } from "../../types";
import { EventTopic } from "../../utils/constants";
import { IEvents } from "../base/Events";

type TBuyerErrors = Partial<Record<keyof ICustomer, string>>;

export class Customer implements ICustomer {
  // Выбранный способ оплаты
  private payment: TPayment = '';
  // Адрес электронной почты покупателя.
  private email: string = '';
  // Контактный номер телефона покупателя.
  private phone: string = '';
  // Физичиский адрес покупателя.
  private address: string = '';

  constructor(private events: IEvents) {
    this.events = events;
  }

  /**
   * Обновляет только те поля, которые переданы в объекте data, не затрагивая остальные. Позволяет обновлять данные поэтапно.
   * @param {Partial<ICustomer>} data  - объект с частичными данными покупателя
   */
  setData(data: Partial<ICustomer>): void {
    
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    this.events.emit(EventTopic.CUSTOMER_RECEIVED);
  }

  /**
   * Возвращает все сохранённые данные покупателя в виде объекта
   * @returns {ICustomer} - ICustomer
   */
  getData(): ICustomer {
    return {
      payment: this.payment as TPayment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  /**
   * Очищает все данные покупателя, устанавливая поля в пустые или null значения.
   */
  clearData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events.emit(EventTopic.CUSTOMER_RECEIVED);
  }

  /**
   * Проверяет все поля на валидность (непустота).
   * @returns {TBuyerErrors | null} - Возвращает TBuyerErrors с сообщениями об ошибках для невалидных полей или возвращает null если все поля валидны;
   */
  validate(): TBuyerErrors | null {
    const errors: TBuyerErrors = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (this.email === '') {
      errors.email = 'Необходимо указать email';
    }

    if (this.phone === '') {
      errors.phone = 'Необходимо указать номер телефона';
    }

    if (this.address === '') {
      errors.address = 'Необходимо указать адрес доставки';
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
}