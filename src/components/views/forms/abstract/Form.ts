import { ICustomer } from "../../../../types";
import { ensureElement } from "../../../../utils/utils";
import { Component } from "../../../base/Component";

/**
 * Интерфейс формы, расширяющий данные покупателя (`ICustomer`) дополнительными полями для управления UI.
 *
 * @property toggleSubmitButton - Флаг для управления активностью кнопки отправки (не используется напрямую как строка)
 * @property messageError - Сообщение об ошибке валидации для отображения в форме
 */
interface IForm extends ICustomer {
  toggleSubmitButton: string,
  messageError: string
}

/** Абстрактный базовый класс для форм ввода данных. */

export abstract class Form extends Component<IForm> {
  protected submitButtonElement: HTMLButtonElement;
  protected formErrorsElement: HTMLElement;

  constructor(container:HTMLElement) {
    super(container);

    this.submitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.formErrorsElement = ensureElement('.form__errors',this.container);
  }

  set toggleSubmitButton(isEnabled: boolean) {
    this.submitButtonElement.disabled = isEnabled;
  }

  set messageError (message: string) {
    this.formErrorsElement.textContent = message;
  }

}