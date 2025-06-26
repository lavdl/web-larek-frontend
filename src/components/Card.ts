import { ICard } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected events: IEvents;
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description: HTMLElement;
	protected _cardButton: HTMLButtonElement;
	protected _index: HTMLElement;
	protected _cardButtonDetete: HTMLButtonElement;
	protected cardId: string;

	constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
		super(container);
		this.events = events;
		this._category = this.container.querySelector('.card__category');
		this._title = this.container.querySelector('.card__title');
		this._image = this.container.querySelector('.card__image');
		this._price = this.container.querySelector('.card__price');
		this._description = this.container.querySelector('.card__text');
		this._cardButton = this.container.querySelector('.card__button');
		this._index = this.container.querySelector('.basket__item-index');
		this._cardButtonDetete = this.container.querySelector('.basket__item-delete')

		if (actions?.onClick) {
			if (this._cardButton) {
				this._cardButton.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set isButtonDisabled(value: boolean) {
		if (this._cardButton) {
			this.setDisabled(this._cardButton, value);
			this.setText(this._cardButton, value ? 'В корзине' : 'В корзину');
		}
	}

	set price(price: number) {
		if (price === null) {
			this.setText(this._price, 'бесценно');
			this.setDisabled(this._cardButton, true);
		} else {
			this.setText(this._price, `${price} синапсов`);
		}
	}

	set image(image: string) {
		this.setImage(this._image, image, this.title);
	}

	set title(name: string) {
		this.setText(this._title, name);
	}

	set category(category: string) {
		this.setText(this._category, category);
		if (this._category) {
			this._category.classList.add(this.getCategoryType(category));
		}
	}

	get id() {
		return this.cardId;
	}
	set id(id: string) {
		this.cardId = id;
	}

	set index(index: number) {
		this.setText(this._index, String(index));
	}

	set description(description: string) {
		this.setText(this._description, description);
	}

	getCategoryType (data: string): string {
		let categoryClass: string;

		switch (data) {
			case 'софт-скил':
				categoryClass = 'card__category_soft';
				break;
			case 'другое':
				categoryClass = 'card__category_other';
				break;
			case 'дополнительное':
				categoryClass = 'card__category_additional';
				break;
			case 'кнопка':
				categoryClass = 'card__category_button';
				break;
			case 'хард-скил':
				categoryClass = 'card__category_hard';
				break;
			default:
				categoryClass = 'card__category_soft';
				break;
		}
		return categoryClass;
	}

	render(data?: Partial<ICard> | undefined): HTMLElement {
		if (!data) return this.container;
		return super.render(data);
	}
}