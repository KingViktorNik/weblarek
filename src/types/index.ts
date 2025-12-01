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
 * Тип для данных формы ввода.
 * Представляет частичное подмножество данных покупателя.
 */
export type TFormData = Partial<ICustomer>

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
 * Интерфейс действий для карточки товара.
 */
export interface ICardActions {
  onClick(): void;
} 
