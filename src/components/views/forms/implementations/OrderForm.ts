import { TPayment } from "../../../../types";
import { EventTopic } from "../../../../utils/constants";
import { ensureAllElements, ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { Form } from "../abstract/Form";

/** Интерфейс данных формы заказа. Описывает структуру данных, которые обрабатывает `OrderForm`. */
interface IOrderForm {
  payment: TPayment,
  address: string
}

/** Компонент формы оформления заказа */
export class OrderForm extends Form<IOrderForm> {
  private addressElement: HTMLInputElement;
  private orderButtons: HTMLElement;
  private buttonsNodes: HTMLButtonElement[];

  constructor(private events:IEvents, container: HTMLElement) {
    super(container);

    this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.orderButtons = ensureElement('.order__buttons', this.container);
    this.buttonsNodes = ensureAllElements('.button', this.orderButtons);
    
    this.buttonsNodes.forEach (button => {
      button.addEventListener('click', () => {
        this.events.emit(EventTopic.FORM_PAYMENT_SELECT, button);  
      })
    })

    this.addressElement.addEventListener('input', () => {
      this.events.emit(EventTopic.FORM_ADDRESS_INPUT, { address: this.addressElement.value });
    });

    this.container.addEventListener('submit', (event?: SubmitEvent) => {
      this.events.emit(EventTopic.ORDER_FORM_SUBMIT, event);
    });
  }

  set payment(value: TPayment) {
    this.buttonsNodes.forEach(button => {
      button.classList.toggle('button_alt', button.name === value);
    })
  }

  set address(address: string) {
    this.addressElement.value = address;
  }

}