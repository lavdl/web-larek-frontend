export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IAppState {
	catalog: ICard[];
	basket: ICard[];
	order: IOrder | null;
	addCardToBasket(card: ICard): void;
	clearBasket(): void;
	deleteCard(cardId: string): void;
	getTotal(): number;
	getCount(): number;
	setCatalog(items: ICard[]): void;
	setOrderField(field: keyof IOrderForm, value: string): void;
	validateOrder(): boolean;
	setContactsField(field: keyof IOrderForm, value: string): void;
	validateContacts(): boolean;
	getBasket(): ICard[]
}

export interface IOrderForm {
	payment: string;
	address: string;
	phone: string;
	email: string;
}

export interface IOrder extends IOrderForm {
	total: number;
	items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
