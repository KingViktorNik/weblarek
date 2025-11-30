import { EventTopic } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * Интерфейс, описывающий данные для компонента Modal.
 */
interface IModal {
  content: HTMLElement;
}

/**
 * Компонент модального окна (Modal), обеспечивающий:
 * - отображение произвольного содержимого;
 * - закрытие по клику на кнопку закрытия;
 * - закрытие по клику на затемнённую область вокруг содержимого;
 * - управление видимостью окна (открытие/закрытие).
 *
 * @extends Component<IModal>
 */
export class Modal extends Component<IModal> {
  /**
   * Элемент DOM — кнопка закрытия модального окна.
   * Соответствует селектору `.modal__close` внутри контейнера компонента.
   */
  private closeButtonElement: HTMLButtonElement;

  /**
   * Элемент DOM, в который вставляется содержимое модального окна.
   * Соответствует селектору `.modal__content` внутри контейнера компонента.
   */
  private content: HTMLElement;

   /**
   * Создаёт экземпляр компонента Modal.
   *
   * @param event - экземпляр системы событий для коммуникации между компонентами
   * @param container - корневой элемент DOM, в котором размещается компонент
   */
  constructor(private event: IEvents, container: HTMLElement) {
    super(container);

    // Получаем элементы DOM для кнопки закрытия и контейнера содержимого
    this.closeButtonElement = ensureElement(this.container.querySelector('.modal__close') as HTMLButtonElement, this.container);
    this.content = ensureElement(this.container.querySelector('.modal__content') as HTMLElement, this.container);

    // Обработчик клика по кнопке закрытия — генерирует событие закрытия модального окна
    this.closeButtonElement.addEventListener('click', () => {
        this.emitCloseModal();
    })

    // Обработчик клика по затемнённой области (контейнеру) — закрывает модальное окно,
    // если клик произошёл именно по контейнеру (а не по внутреннему содержимому)
    this.container.addEventListener('click', event => {
      if(event.target === event.currentTarget) {
        this.emitCloseModal();
      }
    })
  }
  
  /**
   * Отправляет событие о закрытии модального окна через систему событий.
   */
  private emitCloseModal() {
    this.event.emit(EventTopic.MODAL_CLOSE);
  }
  /**
   * Открывает модальное окно и вставляет указанное содержимое.
   *
   * @param content - элемент DOM, который будет отображён внутри модального окна
   */
  open(content: HTMLElement): void {
    this.content.replaceChildren(content)
    this.container.classList.add('modal_active');
  }

  /**
   * Закрывает модальное окно:
   * - очищает содержимое;
   * - убирает класс, активирующий видимость окна.
   */
  close(): void {
    this.content.replaceChildren();
    this.container.classList.remove('modal_active');
  }

}