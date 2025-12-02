import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL, BUTTON_TEXT_BUY, BUTTON_TEXT_REMOVE, BUTTON_TEXT_UNAVAILABLE, CDN_URL, CURRENCY, EventTopic } from './utils/constants';
import { ApiService } from './components/services/ApiService';
import { ICustomer, IOrderRequest, IProduct, ISubmitAndGetIdTotal, TFormData, TPayment} from './types';
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

/** Загрузка списка товаров из API и сохранение в модели */
apiService.getProducts()
  .then(products => {
    productsModel.setProductList(products);
  }) 
  .catch(error => console.error('Ошибка при загрузке товаров из каталога API:', error));

/** Обработка события получения списка товаров — отображаем их в галерее */
eventEmitter.on(EventTopic.PRODUCT_RECEIVED, () => {
  const productList = productsModel.getProductList().map(product => {
    const productCard = new ProductCard(cloneTemplate('#card-catalog'), {
      onClick: () => eventEmitter.emit(EventTopic.PRODUCT_SELECT_CARD, product) 
    });
    
    const productData =  {
      ...product,
      image: CDN_URL + product.image
    }    
    return productCard.render(productData);
  });
  
  gallery.productList = productList;
});

/** Обработка выбора карточки товара — сохраняем выбранный товар в модели */
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

    const data = {
      ...product, 
      image: CDN_URL + product.image,
      isButtonEnabled: product.price,
      textButton: buttonTextContent
    }
    previewCard.render(data);
    productsModel.setSelectedProduct(product);
  });

/** Открытие предпросмотра карточки товара в модальном окне */
eventEmitter.on(EventTopic.PRODUCT_SELECTED, () => {
  modal.open(previewCard.render())
});

/** Добавление/удаление товара в корзине при отправке действия из карточки */
eventEmitter.on(EventTopic.PRODUCT_SUBMIT, () => {
  const product = productsModel.getSelectedProduct();

  if (product) {
    if (shoppingCart.hasProduct(product.id)) {
      shoppingCart.remove(product);
    } else {
      shoppingCart.add(product);
    }
  }
  modal.close();
});

/** Обновление списка товаров в корзине и отображение общей суммы */
eventEmitter.on(EventTopic.BASKET_LIST_UPDATE, () => {
  const list = shoppingCart.getList()
    .map( (product, index) => {
      const productBasket = new BasketCard(cloneTemplate('#card-basket'), {
        onClick: () => eventEmitter.emit(EventTopic.BASKET_PRODUCT_REMOVE, product)
      })

    const productData = {
      ...product,
      indexElement: ++index
    };

    return productBasket.render(productData);
  });

  const basketData = {
    listProduct: list,
    priceTotal: shoppingCart.getTotalPrice(),
    isOrderButtonDisabled: shoppingCart.getTotalPrice() === 0  
  }
  
  header.render({ counter:shoppingCart.getProductCount() });
  basket.render(basketData);
}); 

/** Открытие модального окна с корзиной товаров */
eventEmitter.on(EventTopic.BASKET_OPEN, () => modal.open(basket.render())); 

/** Удаление товара из корзины */
eventEmitter.on(EventTopic.BASKET_PRODUCT_REMOVE, (product: IProduct) => {
  const basketProduct = productsModel.getProductById(product.id);

  if (basketProduct) {
    shoppingCart.remove(basketProduct);
  }

});

/** Обновление данных о покупателе */
eventEmitter.on(EventTopic.CUSTOMER_RECEIVED, () => {
  const customerData = {...customer.getData()};

    const errorMessageOrderForm = getErrorMessages (
    customer.validate() as ICustomer,
    ['address', 'payment']
  );
  
  const errorMessageContactsForm = getErrorMessages (
    customer.validate() as ICustomer, 
    ['phone', 'email']
  );

  orderForm.render({ 
    ...customerData,
    messageError: errorMessageOrderForm,
    toggleSubmitButton: errorMessageOrderForm
  });

  contactsForm.render({
    ...customerData, 
    messageError: errorMessageContactsForm,
    toggleSubmitButton: errorMessageContactsForm    
  });
});

/* Открытие формы оформления заказа (способ оплаты, адрес) */
eventEmitter.on(EventTopic.ORDER_FORM_OPEN, () => 
  modal.open(orderForm.render())
);

eventEmitter.on(EventTopic.ORDER_FORM_SUBMIT, (event: SubmitEvent) => {
  event.preventDefault();
  modal.open(contactsForm.render());
})

/** Выбор способа оплаты */
eventEmitter.on(EventTopic.FORM_PAYMENT_SELECT, (button:HTMLButtonElement) => {
  customer.setData({ payment: button.name as TPayment });
});

eventEmitter.on(EventTopic.FORM_ADDRESS_INPUT, (data: TFormData) =>
  customer.setData({ address: data.address })
);

eventEmitter.on(EventTopic.FORM_EMAIL_INPUT, (data: TFormData) => {
  customer.setData({ email:data.email });
});

eventEmitter.on(EventTopic.FORM_PHONE_INPUT, (data: TFormData) => {
  customer.setData({ phone: data.phone });
});

/**
 * Обработка отправки формы контактов.
 * - Предотвращает стандартное поведение формы.
 * - Запускает процесс отправки заказа через `orderManager`.
 */
eventEmitter.on(EventTopic.CONTACT_FORM_SUBMIT, (event: SubmitEvent) => {
  event.preventDefault();
  submitOrder();
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

/** Создаёт объект запроса на оформление заказа на основе текущих данных */
function createOrderRequest(): IOrderRequest {
  return {
    ...customer.getData(),
    items: shoppingCart.getList().map(item => item.id),
    total: shoppingCart.getTotalPrice(),
  };
}

/**Отправляет заказ через API */
async function  submitOrder(): Promise<void> {
  const orderRequest = createOrderRequest();
  try {
    const order = await apiService.sendOrder(orderRequest);
    handleSuccess(order);
  } catch (error) {
    handleError(error as Error);
  }
}

/** Обрабатывает успешный ответ от сервера после отправки заказа */
function handleSuccess(order: ISubmitAndGetIdTotal): void {
  // Открывает модальное окно с подтверждением успеха.
  modal.open(
    successForm.render({
      description: `Списано ${order.total} ${CURRENCY}`
    })
  );
  // Очищает корзину и данные клиента
  shoppingCart.clear();
  customer.clearData();
}

/** Обрабатывает ошибку при отправке заказа. Выводит ошибку в консоль */
function handleError(error: Error): void {
  console.error('Ошибка отправки заказа:', error);
}
