import { Model } from './base/Model';
import {FormErrors, IAppState, ICard, IOrder, IOrderForm} from '../types';


export class AppState extends Model<IAppState> {
	cardsBasket: ICard[] = [];
	catalog: ICard[];
	order: IOrderForm = {
		email: '',
		phone: '',
		address: '',
		payment: '',
	};
	formErrors: FormErrors = {};
	formErrorsContacts: FormErrors = {};

	addCardToBasket(card: ICard) {
		this.cardsBasket.push(card);
	}

	clearBasket() {
		this.cardsBasket = [];
		this.order = {
		email: '',
		phone: '',
		address: '',
		payment: '',
		};
		this.events.emit('basket:changed');
	}

	deleteCard(cardId: string) {
		this.cardsBasket = this.cardsBasket.filter((item) => item.id !== cardId);
	}

	getTotal() {
		return this.cardsBasket.reduce((total, card) => {
			if (card.price !== null) {
				return total + card.price;
			}
			return total;
		}, 0);
	}

	getCount() {
		return this.cardsBasket.length;
	}

	setCatalog(items: ICard[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес!';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты!';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setContactsField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	validateContacts() {
		const errors: typeof this.formErrorsContacts = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email-адрес!';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать номер телефона!';
		}

		this.formErrorsContacts = errors;
		this.events.emit('formErrorsContacts:change', this.formErrorsContacts);
		return Object.keys(errors).length === 0;
	}

	getBasket() {
		return this.cardsBasket;
	}
}
