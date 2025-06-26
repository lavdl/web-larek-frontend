import { IApi, ICard, IOrder } from '../types';

interface IApiResponse {
	total: number;
	items: ICard[];
}

interface IOrderResult {
	id: string;
	total: number;
}

export class AppApi {
	private _baseApi: IApi;
	readonly cdn: string;
	constructor(cdn: string, baseApi: IApi) {
		this._baseApi = baseApi;
		this.cdn = cdn;
	}

	getCards(): Promise<ICard[]> {
		return this._baseApi.get('/product/').then((response: IApiResponse) => {
			return response.items.map((card: ICard) => {
				card.image = `${this.cdn}${card.image}`;
				return card;
			});
		});
	}

	orderSend(order: IOrder): Promise<IOrderResult> {
		return this._baseApi.post('/order', order).then((data: IOrderResult) => data);
	}
}
