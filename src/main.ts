import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Api } from './components/base/Api';
import { ApiService } from './components/services/ApiService';
import { API_URL } from './utils/constants';
import { ShoppingCart } from './components/models/ShoppingCart';
import { Customer } from './components/models/Customer';

const productsModel = new ProductCatalog();
productsModel.setProductList(apiProducts.items); 
console.log(`Массив товаров из каталога: `, productsModel.getProductList());

const shoppingCart = new ShoppingCart();
const product_1 = productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390');
if (product_1) { 
  shoppingCart.add(product_1);
}
const product_2 = productsModel.getProductById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
if (product_2) { 
  shoppingCart.add(product_2);
}

const product_3 = productsModel.getProductById('b06cde61-912f-4663-9751-09956c0eed67');
if (product_3) {
  shoppingCart.add(product_3);
}

console.log(`Карзина:`, shoppingCart.getList());
console.log(`Кол-во товаров в карзине: `, shoppingCart.getProductCount());
console.log(`Сумма всех товаров в карзине: `,shoppingCart.getTotalPrice());

if (product_3) {
  shoppingCart.remove(product_3);
}

console.log(`Карзина:`, shoppingCart.getList());
console.log(`Кол-во товаров в карзине: `, shoppingCart.getProductCount());
console.log(`Сумма всех товаров в карзине: `,shoppingCart.getTotalPrice());

const user = new Customer();
user.setData({
  payment: 'online',
  email: 'mail@mail.org',
  phone: '+79118881122'
});

console.log(`Данные покупателя`,user.getData());
console.log(`Данные прользователя(null зачит всё хорошо): `, user.validate());

user.setData({ address: 'ул. Ленина, 35' });
console.log(`Данные покупателя`,user.getData());
console.log(`Данные прользователя(null зачит всё хорошо): `, user.validate());

// Инициализация API-клиента
const api = new Api(API_URL);
const apiService = new ApiService(api);

// Получаем товары с сервера
apiService.getProducts()
    .then((products) => {
        productsModel.setProductList(products);
        console.log('Массив товаров из каталога API:', productsModel.getProductList());
    })
    .catch((error) => {
        console.error('Ошибка при загрузке товаров из каталога API:', error);
    });

apiService.sendOrder(user.getData(), shoppingCart.getList(), shoppingCart.getTotalPrice())
  .then(order => console.log(`Данные отправленны успешно (id,total): `, order.id, order.total))
  .catch(error => console.log(`Ошибка:`, error));