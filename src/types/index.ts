/**
 * Перечисление допустимых HTTP‑методов для POST‑запросов в API.
 * Включает стандартные методы модификации данных: создание, обновление, удаление.
 */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/**
 * Базовый интерфейс API для взаимодействия с сервером.
 * Предоставляет методы GET и POST для работы с ресурсами.
 * @template T - тип данных, ожидаемый в ответе (должен быть объектом)
 */
export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

/**
 * Интерфейс товара в каталоге интернет‑магазина.
 * Описывает полную информацию о продукте, доступную для отображения.
 */
export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

/**
 * Перечисление возможных способов оплаты заказа.
 * Определяет допустимые варианты расчёта при оформлении покупки.
 */
export type TPayment = 'online' | 'cash' | '';

/**
 * Интерфейс данных покупателя.
 * Содержит контактную и платёжную информацию клиента.
 */
export interface ICustomer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

/**
 * Интерфейс запроса на оформление заказа.
 * Расширяет данные покупателя информацией о заказе.
 */
export interface IOrderRequest extends ICustomer {
  total: number; // Итоговая сумма заказа
  items: string[]; // Массив ID товаров в заказе
} 

/**
 * Интерфейс ответа сервера после отправки заказа.
 * Возвращается после успешного создания заказа.
 */
export interface ISubmitAndGetIdTotal {
  id: string; // Уникальный идентификатор заказа
  total: number; // Итоговая сумма заказа (дублирует переданное значение)
}

/**
 * Интерфейс товара карточки, дополнительной информации. 
 * url изображения и тект кнопки.
 */
export interface IUrlAndButtonText {
  imageUrl: string;
  buttonTextContent: string;
}

/** Интерфейс данных, порядковый номер */
export interface IItemIndex {
  itemIndex: string;
}

/**
 * Интерфейс действий для карточки товара.
 */
export interface ICardActions {
  onClick(): void;
} 

/**
 * Интерфейс ошибок валидации формы ввода данных покупателя.
 * Содержит сообщения об ошибках для полей.
 */
export interface IFormError extends ICustomer {
  error: string;
}

/**
 * Хранит список товаров.
 */
export interface IProductDOMList {
  productItems: HTMLElement[];
}

/**
 * Интерфейс итоговой суммы заказа.
 * Содержит рассчитанную стоимость покупки.
 */
export interface IOrderTotal {
  orderTotal: number;
}

/**
 * Возвращается при успешном выполнении операции.
 */
export interface ISuccess {
  description: string;
}

/**
 * Тип для комбинированных данных корзины и итоговой суммы.
 * Объединяет частичные данные корзины и суммы заказа.
 */
export type TBasketListAndOrderTotal = Partial<IProductDOMList> & Partial<IOrderTotal>

/**
 * Тип для данных формы ввода.
 * Представляет частичное подмножество данных покупателя.
 */
export type TFormData = Partial<ICustomer>

/**
 * Тип для товара с порядковым номером.
 * Объединяет частичное описание товара и его порядковый номер в корзине.
 */
export type TSequentialProduct = Partial<IProduct> & Partial<IItemIndex>

/**
 * Тип для товара карточки, дополнительной информации. 
 * url изображения и тект кнопки.
 */
export type TProductUrlButtonText = Partial<IProduct> & Partial<IUrlAndButtonText>

/**
 * Тип для данных успешного ответа.
 * Возвращается при успешном выполнении операции.
 */
export type TSuccessData = Partial<ISuccess> 

/**
 * Тип для ошибок данных покупателя.
 * Содержит частичное подмножество возможных ошибок валидации.
 */
export type TCustomerErrors = Partial<ICustomer>