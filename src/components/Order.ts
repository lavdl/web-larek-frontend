import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';

export class Order extends Form<IOrderForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._card = container.querySelector('button[name="card"]');
		this._cash = container.querySelector('button[name="cash"]');

		this._card.addEventListener('click', () => {
			this.events.emit('order.payment:change', {
				field: 'payment',
				value: 'card',
			});
			this.setTypeCard(this._card);
		});

		this._cash.addEventListener('click', () => {
			this.events.emit('order.payment:change', {
				field: 'payment',
				value: 'cash',
			});
			this.setTypeCard(this._cash);
		});
	}

	setTypeCard(activeButton: HTMLElement) {
		this.toggleClass(
			this._card,
			'button_alt-active',
			this._card === activeButton
		);
		this.toggleClass(
			this._cash,
			'button_alt-active',
			this._cash === activeButton
		);
	}

	toggleClass(element: HTMLElement, className: string, add: boolean) {
		if (add) {
			element.classList.add(className);
		} else {
			element.classList.remove(className);
		}
	}
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
