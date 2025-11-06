import { IApi, IProduct, ICustomer, IOrderRequest, ISubmitAndGetIdTotal } from '../../types';

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  /**
   * Получает каталог товаров с сервера
   * @returns Массив товаров
   */
  async getProducts(): Promise<IProduct[]> {
    return this.api.get<IProduct[]>('/product/');
  }

  /**
   * Отправляет данные заказа на сервер
   * @param customer Данные покупателя
   * @param items Список товаров в корзине
   * @returns Промис без данных (ожидается статус 200)
   */
    
  async sendOrder(customer: ICustomer, items: IProduct[], total: number): Promise<ISubmitAndGetIdTotal> {
    try {
      const orderData: IOrderRequest = {
        ...customer,
        items: items.map(item => item.id),
        total: total,
      };
      return await this.api.post<ISubmitAndGetIdTotal>('/order/', orderData)
    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      throw error; 
    }
  }
}