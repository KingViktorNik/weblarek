import { IApi, IProduct, ICustomer, IOrderRequest, ISubmitAndGetIdTotal } from '../../types';

type TProductsApiResponse = { total: number, 
                             items:Promise<IProduct[]> 
                          } 

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
    try {
      const data = await this.api.get<TProductsApiResponse>('/product/');
      return data.items;
    } catch (error) {
      console.error('Не удалось получить каталог:', error);
      return []; // Возвращаем пустой массив при ошибке
    }
  }

  /**
   * Отправляет данные заказа на сервер
   * @param customer Данные покупателя
   * @param items Список товаров в корзине
   * @returns Промис без данных (ожидается статус 200)
   */
    
  async sendOrder(orderData: IOrderRequest): Promise<ISubmitAndGetIdTotal> {
    try {
      return await this.api.post<ISubmitAndGetIdTotal>('/order/', orderData)
    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      throw error; 
    }
  }
}