import { AppApi } from './components/AppApi';
import { AppState, CardItem } from './components/AppData';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { Contacts } from './components/Contacts';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { Success } from './components/Success';
import './scss/styles.scss';
import { IApi, ICard, IOrderForm } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(document.querySelector('#modal-container'), events);


const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');


const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

api
	.getCards()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((card) => {
		const cardInstant = new Card(cloneTemplate(cardTemplate), events, {
			onClick: () => events.emit('card:select', card),
		});
		return cardInstant.render(card);
	});
});

events.on('card:select', (card: ICard) => {
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events, {
		onClick: () => {
			events.emit('card:added', card);
			cardPreview.isButtonDisabled = true;
		},
	});

	cardPreview.isButtonDisabled = appData
		.getBasket()
		.some((basketCard) => basketCard.id === card.id);

	modal.render({
		content: cardPreview.render(card),
	});
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:open', () => {
	page.locked = true;
	basketUpdate();
});

events.on('card:added', (card: CardItem) => {
	appData.addCardToBasket(card);
	page.counter = appData.getCount();
});

events.on('card:delete', ({ card }: { card: string }) => {
	appData.deleteCard(card);
	page.counter = appData.getCount();
	events.emit('basket:changed');
});

events.on('basket:changed', () => {
	basketUpdate();
});

function basketUpdate() {
	basket.items = appData.getBasket().map((card, currentIndex) => {
		const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events, {
			onClick: () => events.emit('card:delete', { card: card.id }),
		});
		cardBasket.index = ++currentIndex;
		return cardBasket.render(card);
	});
	basket.total = appData.getTotal();
	appData.order.total = appData.getTotal();
	appData.order.items = appData.getBasket().map((card) => card.id);
	basket.selected = appData.getBasket();
	modal.render({ content: basket.render() });
}

events.on('basket:checkout', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order.payment:change', (htlmButtonCard: HTMLButtonElement) => {
	order.setTypeCard(htlmButtonCard);
	appData.order.payment = htlmButtonCard.name;
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('  ');
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

events.on('formErrorsContacts:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('  ');
});

events.on('contacts:submit', () => {
	api
		.orderSend(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					page.counter = appData.getCount();
				},
			});
			success.total = result.total;
			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});