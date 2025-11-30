import { IFormError, TFormData } from "../../../../types";
import { EventTopic } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { Form } from "../abstract/Form";

/**
 * Компонент формы заказа (OrderForm), расширяющий базовый класс Form.
 * Обеспечивает:
 * - выбор способа оплаты (онлайн/наличными);
 * - ввод адреса доставки;
 * - отправку данных формы;
 * - визуальное выделение выбранного способа оплаты;
 * - обработку изменений полей и отправку событий.
 *
 * @extends Form
 */
export class OrderForm extends Form {
  /**
   * Элемент DOM — кнопка выбора оплаты онлайн.
   * Соответствует селектору `button[name="card"]` внутри контейнера формы.
   */
  private onlineButtonElement: HTMLButtonElement;

  /**
   * Элемент DOM — кнопка выбора оплаты наличными.
   * Соответствует селектору `button[name="cash"]` внутри контейнера формы.
   */
  private cashButtonElement: HTMLButtonElement;

  /**
   * Элемент DOM — поле ввода адреса доставки.
   * Соответствует селектору `input[name="address"]` внутри контейнера формы.
   */
  private addressElement: HTMLInputElement;
  
  /**
   * Создаёт экземпляр компонента OrderForm.
   *
   * @param events - экземпляр системы событий для коммуникации между компонентами
   * @param container - корневой элемент DOM, в котором размещается форма
   */
  constructor(private events:IEvents, container: HTMLElement) {
    super(container);

    // Получаем элементы DOM для кнопок оплаты и поля адреса
    this.onlineButtonElement = ensureElement(
      this.container.querySelector('button[name="card"]') as HTMLButtonElement, 
      this.container
    );

    this.cashButtonElement = ensureElement(
      this.container.querySelector('button[name="cash"]') as HTMLButtonElement, 
      this.container
    );

    this.addressElement = ensureElement(
      this.container.querySelector('input[name="address"]') as HTMLInputElement, 
      this.container
    );

    // Обработчики кликов по кнопкам выбора способа оплаты
    this.onlineButtonElement.addEventListener('click', () => {
      const data: TFormData = {
        payment: 'online'
      }
      
      this.events.emit(EventTopic.ORDER_FORM_ONLINE_METHOD_SELECT, data);
    });

    this.cashButtonElement.addEventListener('click', () => {
      const data: TFormData = {
        payment: 'cash'
      }

      this.events.emit(EventTopic.ORDER_FORM_CASH_METHOD_SELECT, data);
    });

    // Обработчик ввода адреса
    this.addressElement.addEventListener('input', () => {
      const data: TFormData = {
        address: this.addressElement.value
      }
      this.events.emit(EventTopic.ORDER_FORM_ADDRESS_INPUT, data);
    });

    // Обработчик отправки формы
    this.container.addEventListener('submit', (event?: SubmitEvent) => {
      this.events.emit(EventTopic.ORDER_FORM_SUBMIT, event);
    });
  }

  /**
   * Визуально выделяет кнопку выбора оплаты онлайн.
   * При активации снимает выделение с кнопки оплаты наличными.
   *
   * @param status - флаг активации (`true` — выделить, `false` — снять выделение)
   */
  paymentOnline(status: boolean) {
    if (status) {
      this.onlineButtonElement.classList.add('button_alt');
      this.paymentCash(false);
      return
    }

    this.onlineButtonElement.classList.remove('button_alt');
  }

  /**
   * Визуально выделяет кнопку выбора оплаты наличными.
   * При активации снимает выделение с кнопки оплаты онлайн.
   *
   * @param status - флаг активации (`true` — выделить, `false` — снять выделение)
   */
  paymentCash(status: boolean) {
    if (status) {
      this.cashButtonElement.classList.add('button_alt');
      this.paymentOnline(false);
      return
    }

    this.cashButtonElement.classList.remove('button_alt');
  }

  /**
   * Отрисовывает форму с переданными данными.
   *
   * @param data - частично заполненные данные формы (опционально), могут содержать:
   *              - `payment` — выбранный способ оплаты (`'online'` или `'cash'`);
   *              - `address` — адрес доставки
   * @returns Отрисованный элемент DOM компонента (container)
   */render(data?: Partial<IFormError>): HTMLElement {
    // Управление выделением кнопок способа оплаты
    if (this.onlineButtonElement && 
        this.cashButtonElement &&
        data?.payment
    ) {
      data.payment === 'online'
        ? this.paymentOnline(true)
        : this.paymentCash(true);
    } else {
      this.paymentOnline(false);
      this.paymentCash(false);
    }

    // Заполнение поля адреса
    if (this.addressElement && data?.address) {
      this.addressElement.value = data.address;
    } else {
      this.addressElement.value = '';
    }

    return super.render(data);
  }

}