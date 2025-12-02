import { EventTopic } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { Form } from "../abstract/Form";

/** Интерфейс данных формы контактов */
interface IContactsForm {
  email: string,
  phone: string,
  messageError:string
}

/** Компонент формы ввода контактных данных (email и телефон) */
export class ContactsForm extends Form implements IContactsForm  {
  private emailElement: HTMLInputElement;
  private phoneElement: HTMLInputElement;

  constructor(private events:IEvents, container: HTMLElement) {
    super(container);

    this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    
    this.emailElement.addEventListener('input', () =>
      this.events.emit(EventTopic.FORM_EMAIL_INPUT, { email: this.emailElement.value })
    );

    this.phoneElement.addEventListener('input', () =>
      this.events.emit(EventTopic.FORM_PHONE_INPUT, { phone: this.phoneElement.value })
    );

    this.container.addEventListener('submit', (event?: SubmitEvent) =>
      this.events.emit(EventTopic.CONTACT_FORM_SUBMIT, event)
    );
  }

  set email (email: string) {
    this.emailElement.value= email;
  }

  set phone (phone: string) {
    this.phoneElement.value = phone;
  }


}