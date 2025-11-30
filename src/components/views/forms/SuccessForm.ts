import { ISuccess, TSuccessData } from "../../../types";
import { EventTopic } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

/**
 * Компонент успешного завершения заказа (SuccessForm), отображающий:
 * - сообщение об успешном оформлении заказа;
 * - возможность закрытия модального окна при клике.
 *
 * Предназначен для информирования пользователя о завершении процесса заказа.
 *
 * @extends Component<ISuccess>
 */
export class SuccessForm extends Component<ISuccess> {
  /**
   * Элемент DOM, отображающий описание успеха (сообщение о заказе).
   * Соответствует селектору `.order-success__description` внутри контейнера компонента.
   */
  private orderSuccessDescriptionElement: HTMLElement;
  
  /**
   * Создаёт экземпляр компонента SuccessForm.
   *
   * @param events - экземпляр системы событий для коммуникации между компонентами
   * @param container - корневой элемент DOM, в котором размещается компонент
   */
  constructor(protected events:IEvents, container: HTMLElement) {
    super(container);

    // Получаем элемент DOM для отображения описания успеха
    this.orderSuccessDescriptionElement = ensureElement(
      this.container.querySelector('.order-success__description') as HTMLElement, 
      this.container
    );

    // При клике на контейнер компонента генерируем событие закрытия модального окна
    this.container.addEventListener('click', () => {
      events.emit(EventTopic.SUCCESS_MODAL_CLOSE);
    });

  }

  /**
   * Отрисовывает компонент с переданными данными.
   *
   *
   * @param data - частично заполненные данные об успехе (опционально),
   *              могут содержать поле `description` с текстом сообщения
   * @returns Отрисованный элемент DOM компонента (container)
   */
  render(data?: Partial<TSuccessData>): HTMLElement {
    // Отображение описания успеха (сообщения о заказе)
    if (this.orderSuccessDescriptionElement && data?.description) {
      this.orderSuccessDescriptionElement.textContent = data.description;
    }

    return super.render(data);
  }

}