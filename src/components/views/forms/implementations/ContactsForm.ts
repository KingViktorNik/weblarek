import { IFormError, TFormData } from "../../../../types";
import { EventTopic } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { Form } from "../abstract/Form";

/**
 * Компонент формы контактов (ContactsForm), расширяющий базовый класс Form.
 * Обеспечивает:
 * - ввод email и номера телефона;
 * - отправку данных формы;
 * - обработку изменений полей и отправку событий при вводе;
 * - восстановление значений полей из переданных данных.
 *
 * @extends Form
 */
export class ContactsForm extends Form {
  /**
   * Элемент DOM — поле ввода email.
   * Соответствует селектору `input[name="email"]` внутри контейнера формы.
   */
  private emailElement: HTMLInputElement;
  
  /**
   * Элемент DOM — поле ввода номера телефона.
   * Соответствует селектору `input[name="phone"]` внутри контейнера формы.
   */
  private phoneElement: HTMLInputElement;
  
  /**
   * Создаёт экземпляр компонента ContactsForm.
   *
   * @param events - экземпляр системы событий для коммуникации между компонентами
   * @param container - корневой элемент DOM, в котором размещается форма
   */
  constructor(private events:IEvents, container: HTMLElement) {
    super(container);

    // Получаем элементы DOM для полей email и телефона
    this.emailElement = ensureElement(
      this.container.querySelector('input[name="email"]') as HTMLInputElement, 
      this.container
    );

    this.phoneElement = ensureElement(
      this.container.querySelector('input[name="phone"]') as HTMLInputElement, 
      this.container
    );

    // Обработчик ввода email
    this.emailElement.addEventListener('input', () => {
      const data: TFormData = {
        email: this.emailElement.value
      }
      this.events.emit(EventTopic.CONTACT_FORM_EMAIL_INPUT, data);
    });

    // Обработчик ввода номера телефона
    this.phoneElement.addEventListener('input', () => {
      const data: TFormData = {
        phone: this.phoneElement.value
      }
      this.events.emit(EventTopic.CONTACT_FORM_PHONE_INPUT, data);
    });

    // Обработчик отправки формы
    this.container.addEventListener('submit', (event: SubmitEvent) => {
      this.events.emit(EventTopic.CONTACT_FORM_SUBMIT, event);
    });
  }

  /**
   * Отрисовывает форму с переданными данными.
   *
   * @param data - частично заполненные данные формы (опционально), могут содержать:
   *              - `email` — адрес электронной почты;
   *              - `phone` — номер телефона
   * @returns Отрисованный элемент DOM компонента (container)
   */
  render(data?: Partial<IFormError>): HTMLElement {
    // Заполнение поля email
    if (this.emailElement && data?.email) {
      this.emailElement.value = data.email;
    } else {
      this.emailElement.value = '';
    }

    // Заполнение поля телефона
    if (this.phoneElement && data?.phone) {
      this.phoneElement.value = data.phone;
    } else {
      this.phoneElement.value = '';
    }

    return super.render(data);
  }

}