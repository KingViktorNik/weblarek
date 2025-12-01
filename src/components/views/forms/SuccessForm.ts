import { EventTopic } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

/** Интерфейс данных для формы успешного завершения заказа. */
export interface ISuccess {
  description: string;
}

/**Компонент модального окна с подтверждением успешного оформления заказа. */
export class SuccessForm extends Component<ISuccess> {
  private descriptionElement: HTMLElement;

  constructor(protected events:IEvents, container: HTMLElement) {
    super(container);

    this.descriptionElement = ensureElement('.order-success__description', this.container);

    this.container.addEventListener('click', () =>
      events.emit(EventTopic.SUCCESS_MODAL_CLOSE)
    );
  }

  set description (description: string) {
    this.descriptionElement.textContent = description;
  }

}