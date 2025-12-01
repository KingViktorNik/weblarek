/** Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 
/** Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

export const settings = {

};

/** Используется для унификации событий в брокере сообщений */
export enum EventTopic {
  // Работа с товаром

  /** Событие: изменение каталога товаров. */
  PRODUCT_RECEIVED = 'product:received',
  /** Событие: выбронная карточка товара. */
  PRODUCT_SELECT_CARD = 'product:selectCard',
  /** Событие: открытия для просмотра карточку с товаром */
  PRODUCT_SELECTED = 'product:selected',
  /** Событие: добовление/удаление товара в карзине */
  PRODUCT_SUBMIT = 'product:submit',

  // Корзина

  /** Событие: открытие корзины. */
  BASKET_OPEN = 'basket:open',
  /** Событие: удаление товара из корзины. */
  BASKET_PRODUCT_REMOVE = 'basket:productRemove',
  /** Событие: обновление списка товаров в корзине. */
  BASKET_LIST_UPDATE = 'basket:listUpdate',
  /** Событие: изменение данных пользователя. */
  CUSTOMER_RECEIVED = 'customer:received',

  // Формы

  /** Событие: водидации форм. */
  FORM_VALIDATION = 'form:validation',
  /** Событие: выбора способа оплаты. */
  FORM_PAYMENT_SELECT = 'form:paymentSelect',
  /** Событие: ввод адреса. */
  FORM_ADDRESS_INPUT = 'form:addressInput',
  /** Событие: ввод email. */
  FORM_EMAIL_INPUT = 'form:emailInput',
  /** Событие: ввод телефона. */
  FORM_PHONE_INPUT = 'form:phoneInput',

  /** Событие: открытие формы orderForm. */
  ORDER_FORM_OPEN = 'orderForm:open',
  /** Событие: отправка заказа, submit формы Order. */
  ORDER_FORM_SUBMIT = 'orderForm:submit',
  
  /** Событие: отправка формы ContactForm. */
  CONTACT_FORM_SUBMIT = 'contactForm:submit',

  /** Событие: закрытие модального окна. */
  MODAL_CLOSE = 'modal:close',
  /** Событие: закрытие модального окна 
   * с подтверждением успеха, после отправки формы. */
  SUCCESS_MODAL_CLOSE = 'successModal:close'
}

// Константы стоимости товаров

/** Денежная еденица */ 
export const CURRENCY = 'синапсов';
/** Стоимость товара со зночением null */
export const PRICE_UNAVAILABLE = 'Бесценно';


// Константы для текста кнопок

/** Текст кнопоки товара у которого значение цены null */
export const BUTTON_TEXT_UNAVAILABLE = 'Недоступно';
/** Текст кнопоки добовление товара в корзины */
export const BUTTON_TEXT_BUY = 'Купить';
/** Текст кнопоки удалиния товара из корзины */
export const BUTTON_TEXT_REMOVE = 'Удалить из корзины';