export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// описывает структуру товара в каталоге. предназначен для хранения полной информации о товаре. 
export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

export type TPayment = 'online' | 'cash' | '';

// предназначен для хранения и управления данными покупателя интернет-магазина.
export interface ICustomer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// описывает структуру данных для запроса на оформление заказа в интернет‑магазине.
export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
} 

// описывающий ответ от сервера после отправки данных. Содержит идентификатор операции и итоговую сумму.
export interface ISubmitAndGetIdTotal {
  id: string;
  total: number;
}