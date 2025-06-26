import { createElement, formatNumber, ensureElement } from '../utils/utils';
import { CardItem } from './AppData';
import { Component } from './base/component';
import { IEvents } from './base/events';

interface IBasket {
	items: HTMLElement[];
	total: number | string;
	selected: string[];
}

export class Basket extends Component<IBasket> {
	protected basketList: HTMLElement;
	protected basketTotal: HTMLElement;
	protected checkoutButton: HTMLButtonElement;
	protected deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.basketList = this.container.querySelector('.basket__list');
		this.basketTotal = this.container.querySelector('.basket__price');
		this.checkoutButton = this.container.querySelector('.basket__button');
		this.deleteButton = this.container.querySelector('.basket__item-delete');

		this.checkoutButton.addEventListener('click', () =>
			this.events.emit('basket:checkout')
		);
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.basketList.replaceChildren(...items);
		} else {
			this.basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(items: CardItem[]) {
		if (items.length) {
			this.setDisabled(this.checkoutButton, false);
		} else {
			this.setDisabled(this.checkoutButton, true);
		}
	}

	set total(total: number) {
		this.setText(this.basketTotal, `${formatNumber(total)} синапсов`);
	}
}
