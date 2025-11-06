//  Класс Customer хранит и управляет данными покупателя, необходимыми для оформления заказа.
// Обеспечивает валидацию данных перед отправкой на сервер.

import { ICustomer, TPayment } from "../../types";

export class Customer implements ICustomer {
  // Выбранный способ оплаты
  private _payment: TPayment = '';
  // Адрес электронной почты покупателя.
  private _email: string = '';
  // Контактный номер телефона покупателя.
  private _phone: string = '';
  // Физичиский адрес покупателя.
  private _address: string = '';

  constructor(
    payment: TPayment = '',
    email: string = '',
    phone: string = '',
    address: string = ''
    ) {
        this._payment = payment;
        this._email = email;
        this._phone = phone;
        this._address = address;
    }

    // Геттеры
    get payment(): TPayment {
        return this._payment;
    }

    get email(): string {
        return this._email;
    }

    get phone(): string {
        return this._phone;
    }

    get address(): string {
        return this._address;
    }

  /**
   * Обновляет только те поля, которые переданы в объекте data, не затрагивая остальные. Позволяет обновлять данные поэтапно.
   * @param {Partial<ICustomer>} data  - объект с частичными данными покупателя
   */
  setData(data: Partial<ICustomer>): void {
    if (data.payment !== undefined) {
      this._payment = data.payment;
    }
    if (data.email !== undefined) {
      this._email = data.email;
    }
    if (data.phone !== undefined) {
      this._phone = data.phone;
    }
    if (data.address !== undefined) {
      this._address = data.address;
    }
  }

  /**
   * Возвращает все сохранённые данные покупателя в виде объекта
   * @returns {ICustomer} - ICustomer
   */
  getData(): ICustomer {
    return {
      payment: this._payment as TPayment, // утверждение типа, т.к. может быть null
      email: this._email,
      phone: this._phone,
      address: this._address
    };
  }

  /**
   * Очищает все данные покупателя, устанавливая поля в пустые или null значения.
   */
  clearData(): void {
    this._payment = '';
    this._email = '';
    this._phone = '';
    this._address = '';
  }

  /**
   * Проверяет все поля на валидность (непустота).
   * @returns {Record<string, string> | null} - Возвращает объект с сообщениями об ошибках для невалидных полей или возвращает null если все поля валидны;
   */
  validate(): Record<string, string> | null {
    const errors: Record<string, string> = {};

    if (this._payment === null) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (this._email === '') {
      errors.email = 'Необходимо указать email';
    }

    if (this._phone === '') {
      errors.phone = 'Необходимо указать номер телефона';
    }

    if (this._address === '') {
      errors.address = 'Необходимо указать адрес доставки';
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
}