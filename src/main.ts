import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL, BUTTON_TEXT_BUY, BUTTON_TEXT_REMOVE, BUTTON_TEXT_UNAVAILABLE, CDN_URL, EventTopic } from './utils/constants';
import { ApiService } from './components/services/ApiService';
import { IProduct, IProductDOMList, TBasketListAndOrderTotal, TCustomerErrors, TFormData,TProductUrlButtonText, TSequentialProduct } from './types';
import { cloneTemplate, ensureElement, getErrorMessages } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { Modal } from './components/views/Modal';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { ProductCard } from './components/views/cards/implementations/ProductCard';
import { PreviewCard } from './components/views/cards/implementations/PreviewCard';
import { ShoppingCart } from './components/models/ShoppingCart';
import { Basket } from './components/views/Basket';
import { BasketCard } from './components/views/cards/implementations/BasketCard';
import { OrderForm } from './components/views/forms/implementations/OrderForm';
import { Customer } from './components/models/Customer';
import { ContactsForm } from './components/views/forms/implementations/ContactsForm';
import { SuccessForm } from './components/views/forms/SuccessForm';
import { OrderManager } from './components/services/OrderManager';

// Получаем основные DOM‑элементы интерфейса
const page = ensureElement(document.querySelector('.page') as HTMLElement);
const headerView = ensureElement(page.querySelector('.header') as HTMLElement);
const galleryView = ensureElement(page.querySelector('.gallery') as HTMLElement);
const modalView = ensureElement(page.querySelector('.modal') as HTMLElement);

// Создаём сервисы
const api = new Api(API_URL);
const apiService = new ApiService(api);

// Инициализируем систему событий
const eventEmitter = new EventEmitter();

// Создаём представления (views)
const gallery = new Gallery(galleryView);
const modal = new Modal(eventEmitter, modalView);
const header = new Header(eventEmitter, headerView);

// Создаём модели данных
const productsModel = new ProductCatalog(eventEmitter);
const shoppingCart = new ShoppingCart(eventEmitter);
const customer = new Customer(eventEmitter);

// Создаём карточки и формы
const previewCard = new PreviewCard(eventEmitter, cloneTemplate('#card-preview'));
const basket = new Basket(eventEmitter, cloneTemplate('#basket'));
const orderForm = new OrderForm(eventEmitter, cloneTemplate('#order'));
const contactsForm = new ContactsForm(eventEmitter, cloneTemplate('#contacts'));
const successForm = new SuccessForm(eventEmitter, cloneTemplate('#success'));

// Создаём менеджер заказов
const orderManager = new OrderManager(
  apiService,
  customer,
  shoppingCart,
  modal,
  successForm,
  header
);

/**
 * Загрузка списка товаров из API и сохранение в модели
 */
apiService.getProducts()
  .then(products => {
    productsModel.setProductList(products);
  }) 
  .catch(error => console.error('Ошибка при загрузке товаров из каталога API:', error));

/**
 * Обработка события получения списка товаров — отображаем их в галерее
 */
eventEmitter.on(EventTopic.PRODUCT_RECEIVED, () => {
  const itemsCard = productsModel.getProductList().map(product => {
    const card = new ProductCard(cloneTemplate('#card-catalog'), {
      onClick: () => eventEmitter.emit(EventTopic.PRODUCT_SELECT_CARD, product) 
    });
    
    const data: TProductUrlButtonText = {
      ...product,
      imageUrl: CDN_URL
    }    
    
    return card.render(data);
  });

  const galleryData: IProductDOMList = {
    productItems: itemsCard
  }
  
  gallery.render(galleryData);
});

/**
 * Обработка выбора карточки товара — сохраняем выбранный товар в модели
 */
eventEmitter.on(EventTopic.PRODUCT_SELECT_CARD, 
  (card: IProduct) => {
    const product = productsModel.getProductById(card.id);
    let buttonTextContent: string;
    
    if (!product) return

    if (!product.price) {
      buttonTextContent = BUTTON_TEXT_UNAVAILABLE;
    } else {
      if (!shoppingCart.hasProduct(product.id)) {
        buttonTextContent = BUTTON_TEXT_BUY;
      } else {
        buttonTextContent = BUTTON_TEXT_REMOVE;
      }
    }

    const data: TProductUrlButtonText = {
      ...product, 
      imageUrl: CDN_URL,
      buttonTextContent: buttonTextContent
    }

    previewCard.render(data);
    productsModel.setSelectedProduct(product);
  });

/**
 * Открытие предпросмотра карточки товара в модальном окне
 */
eventEmitter.on(EventTopic.PRODUCT_SELECTED, () => {
  const selectedProduct = productsModel.getSelectedProduct();
  previewCard.updateButtonState(selectedProduct?.price);

  modal.open(previewCard.render())
});

/**
 * Добавление/удаление товара в корзине при отправке действия из карточки
 */
eventEmitter.on(EventTopic.PRODUCT_SUBMIT, () => {
  const product = productsModel.getSelectedProduct();

  if (product) {
    if (shoppingCart.hasProduct(product.id)) {
      shoppingCart.remove(product);
    } else {
      shoppingCart.add(product);
    }

    header.setCounter(shoppingCart.getProductCount());
  }
  modal.close();
});

/**
 * Обновление списка товаров в корзине и отображение общей суммы
 */
eventEmitter.on(EventTopic.BASKET_LIST_UPDATE, () => {
  const list = shoppingCart.getList()
    .map( (product, index) => {
      const productBasket = new BasketCard(cloneTemplate('#card-basket'), {
        onClick: () => eventEmitter.emit(EventTopic.BASKET_PRODUCT_REMOVE, product)
      })

    const productData: TSequentialProduct = {
      ...product,
      itemIndex: (++index).toString()
    };

    return productBasket.render(productData);
  });

  const basketData: TBasketListAndOrderTotal = {
    productItems: list,
    orderTotal: shoppingCart.getTotalPrice()
  }
  
  basket.render(basketData);
}); 

/**
 * Открытие модального окна с корзиной товаров
 */
eventEmitter.on(EventTopic.BASKET_OPEN, () => modal.open(basket.render())); 

/**
 * Удаление товара из корзины
 */
eventEmitter.on(EventTopic.BASKET_PRODUCT_REMOVE, (product: IProduct) => {
  const basketProduct = productsModel.getProductById(product.id);

  if (basketProduct) {
    shoppingCart.remove(basketProduct);
    header.setCounter(shoppingCart.getProductCount())
  }

  shoppingCart.getList().length === 0 
    ? basket.basketButtonDisable()
    : basket.basketButtonEnable();

  const basketData: TBasketListAndOrderTotal = {
    orderTotal: shoppingCart.getTotalPrice()
  }

  basket.render(basketData);
});

/**
 * Открытие формы оформления заказа (способ оплаты, адрес)
 */
eventEmitter.on(EventTopic.ORDER_FORM_OPEN, () => {
  modal.open(orderForm.render(customer.getData()));
});

/**
 * Выбор способа оплаты «онлайн»
 */
eventEmitter.on(EventTopic.ORDER_FORM_ONLINE_METHOD_SELECT, 
  (data: TFormData)  => {
  if (data.payment) {
    orderForm.paymentOnline(true);
    customer.setData(data);
  }
});
/**
 * Выбор способа оплаты «при получении»
 */
eventEmitter.on(EventTopic.ORDER_FORM_CASH_METHOD_SELECT, (data: TFormData) => {
  if (data.payment) {
    orderForm.paymentCash(true);
    customer.setData(data);
  }
});

/**
 * Обработка ввода адреса доставки в форме заказа.
 * Сохраняет введённые данные в модель клиента.
 */
eventEmitter.on(EventTopic.ORDER_FORM_ADDRESS_INPUT, (data: TFormData) => {
  customer.setData(data);
});

/**
 * Обработка отправки формы заказа (нажатие кнопки submit).
 * Предотвращает стандартное поведение формы и инициирует открытие формы контактов.
 */
eventEmitter.on(EventTopic.ORDER_FORM_SUBMIT, (event: SubmitEvent) => {
  event.preventDefault();
  modal.open(contactsForm.render());
  contactsForm.enableSubmit();
})

/**
 * Валидация данных формы заказа (адрес и способ оплаты).
 * - Получает сообщения об ошибках через `getErrorMessages`.
 * - Отображает ошибки в форме заказа.
 * - Блокирует кнопку отправки, если есть ошибки, иначе разблокирует.
 */
eventEmitter.on(EventTopic.ORDER_FORM_VALIDATION_ERROR, () => {

  const errorMessage = getErrorMessages(
    customer.validate() as TCustomerErrors,
    ['address', 'payment']
  );
  
  orderForm.setMessageError(errorMessage);
  errorMessage
    ? orderForm.disableSubmit()
    : orderForm.enableSubmit();
});

/**
 * Обработка ввода email в форме контактов.
 * Сохраняет введённый email в модель клиента.
 */
eventEmitter.on(EventTopic.CONTACT_FORM_EMAIL_INPUT, (data: TFormData) => {
  customer.setData(data);
});

/**
 * Обработка ввода телефона в форме контактов.
 * Сохраняет введённый телефон в модель клиента.
 */
eventEmitter.on(EventTopic.CONTACT_FORM_PHONE_INPUT, (data: TFormData) => {
  customer.setData(data);
});

/**
 * Валидация данных формы контактов (email и телефон).
 * - Получает сообщения об ошибках через `getErrorMessages`.
 * - Отображает ошибки в форме контактов.
 * - Блокирует кнопку отправки, если есть ошибки, иначе разблокирует.
 */
eventEmitter.on(EventTopic.CONTACT_FORM_VALIDATION_ERROR, () => {

  const errorMessage = getErrorMessages(
    customer.validate() as TCustomerErrors, 
    ['phone', 'email']
  );
  
  contactsForm.setMessageError(errorMessage);
  errorMessage
    ? contactsForm.disableSubmit()
    : contactsForm.enableSubmit();
});

/**
 * Обработка отправки формы контактов.
 * - Предотвращает стандартное поведение формы.
 * - Запускает процесс отправки заказа через `orderManager`.
 */
eventEmitter.on(EventTopic.CONTACT_FORM_SUBMIT, (event: SubmitEvent) => {
  event.preventDefault();
  orderManager.submitOrder();
});

/**
 * Закрытие модального окна с подтверждением успеха после отправки заказа.
 */
eventEmitter.on(EventTopic.SUCCESS_MODAL_CLOSE, () => modal.close());

/**
 * Общее закрытие модального окна по событию.
 */
eventEmitter.on(EventTopic.MODAL_CLOSE, () => {
  modal.close();
});
