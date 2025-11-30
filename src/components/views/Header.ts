import { EventTopic } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * Интерфейс, описывающий данные для компонента Header.
 */
interface IHeader {
    /**
   * Текущее значение счётчика товаров в корзине.
   */
  counter: number;
}

/**
 * Компонент шапки приложения (Header), отображающий счётчик товаров в корзине
 * и содержащий кнопку для открытия корзины.
 * 
 * Отвечает за:
 * - отображение количества товаров в корзине;
 * - обработку клика по кнопке корзины;
 * - обновление счётчика;
 * - сброс счётчика до нуля.
 * 
 * @extends Component<IHeader>
 */
export class Header extends Component<IHeader> {
  /**
   * Элемент DOM, отображающий количество товаров в корзине.
   * Соответствует селектору `.header__basket-counter`.
   */
  protected counterElement: HTMLElement;
  /**
   * Кнопка открытия корзины.
   * Соответствует селектору `.header__basket`.
   */
  protected basketButton: HTMLButtonElement;

    /**
   * Создаёт экземпляр компонента Header.
   * 
   * @param events - экземпляр системы событий для коммуникации между компонентами
   * @param container - корневой элемент DOM, в котором размещается компонент
   */
  constructor(private events: IEvents, container: HTMLElement) {
    super(container);
    
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    // При клике на кнопку корзины генерируем событие открытия корзины
    this.basketButton.addEventListener('click', () => {
        this.events.emit(EventTopic.BASKET_OPEN);
    })
  }

  /**
   * Устанавливает новое значение счётчика товаров в корзине.
   * 
   * @param value - новое значение счётчика (количество товаров)
   */
  setCounter(value: number) {
    this.counterElement.textContent = String(value);
  }

  /**
   * Сбрасывает значение счётчика товаров в корзине до нуля.
   */
  counterClear() {
    this.setCounter(0);
  }
  
}