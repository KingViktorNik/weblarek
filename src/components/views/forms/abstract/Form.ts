import { IFormError } from "../../../../types";
import { ensureElement } from "../../../../utils/utils";
import { Component } from "../../../base/Component";

/**
 * Абстрактный базовый класс для форм (Form), обеспечивающий:
 * - управление активностью кнопки отправки;
 * - отображение сообщений об ошибках;
 * - базовую логику отрисовки формы.
 *
 * Предназначен для наследования конкретными реализациями форм.
 *
 * @extends Component<IFormError>
 */
export abstract class Form extends Component<IFormError> {
  /**
   * Элемент DOM — кнопка отправки формы.
   * Соответствует селектору `button[type="submit"]` внутри контейнера компонента.
   */
  protected submitButtonElement: HTMLButtonElement;

  /**
   * Элемент DOM, отображающий сообщения об ошибках формы.
   * Соответствует селектору `.form__errors` внутри контейнера компонента.
   */
  protected formErrorsElement: HTMLElement;

  /**
   * Создаёт экземпляр компонента Form.
   *
   * @param container - корневой элемент DOM, в котором размещается форма
   */
  constructor(container:HTMLElement) {
    super(container);
    // Получаем элементы DOM для кнопки отправки и контейнера ошибок
    this.submitButtonElement = ensureElement(
      this.container.querySelector('button[type="submit"]') as HTMLButtonElement, 
      this.container
    );
    this.formErrorsElement = ensureElement(
      this.container.querySelector('.form__errors') as HTMLElement, 
      this.container
    );
  }

  /**
   * Активирует кнопку отправки формы.
   */
  enableSubmit() {
    this.submitButtonElement.disabled = false;
  }

  /**
   * Деактивирует кнопку отправки формы.
   */
  disableSubmit() {
    this.submitButtonElement.disabled = true;
  }

  /**
   * Устанавливает текстовое сообщение об ошибке в форме.
   *
   * @param message - текст сообщения об ошибке, который будет отображён
   */
  setMessageError (message: string) {
    this.formErrorsElement.textContent = message;
  }

  /**
   * Отрисовывает форму с переданными данными.
   *
   * @param data - частично заполненные данные об ошибках формы (опционально)
   * @returns Отрисованный элемент DOM компонента (container)
   */
  render(data?: Partial<IFormError> | undefined): HTMLElement {
    // По умолчанию кнопка отправки деактивирована
    this.disableSubmit();

    return super.render(data);
  }

}