import IOption from './model/IOption.js';
import Order from './model/Order.js';

class KotakSecurityClient {

	baseUrl: string = 'https://tradeapi.kotaksecurities.com/apim';

	private userId: string;
	private password: string
	private appId: string;
	private consumerKey: string;
	private secretKey: string;
	private accessCode: string;

	private sessionheader!: {
		consumerKey: string;
		sessionToken: string;
	};

	constructor(opts: IOption) {
		this.userId = opts.userId;
		this.password = opts.password;
		this.appId = opts.appId;
		this.consumerKey = opts.consumerKey;
		this.secretKey = opts.secretKey;
		this.accessCode = opts.accessCode;

		this.init();
	}

	async init() {
		let initHeaders = {
			'Content-Type': 'application/json',
			userid: this.userId,
			appId: this.appId,
			consumerKey: this.consumerKey,
			Authorization: `Bearer ${this.secretKey}`
		};
		let initUrl = `${this.baseUrl}/session/1.0/session/init`;
		await (await fetch(initUrl, {
			headers: initHeaders
		})).json();

		let loginUrl = `${this.baseUrl}/session/1.0/session/login/userid`;
		let loginBody = {
			userid: this.userId,
			password: this.password
		};
		let loginData = await (await fetch(loginUrl, {
			method: 'POST',
			body: JSON.stringify(loginBody),
			headers: initHeaders
		})).json();

		let sessionTokenUrl = `${this.baseUrl}/session/1.0/session/2FA/accesscode`;
		let sessionTokenBody = {
			userid: this.userId,
			accessCode: this.accessCode
		};
		let sessionTokenHeaders = Object.assign({}, initHeaders, { oneTimeToken: loginData.oneTimeToken });
		let sessionTokenData = await (await fetch(sessionTokenUrl, {
			method: 'POST',
			body: JSON.stringify(sessionTokenBody),
			headers: sessionTokenHeaders
		})).json();

		this.sessionheader = {
			consumerKey: this.consumerKey,
			sessionToken: sessionTokenData.sessionToken
		}
	}

	async placeIntradayOrder(order: Order) {
		let url = `${this.baseUrl}/orders/1.0/order/mis`;
		let body = JSON.stringify(order);

		let data = await (await fetch(url, {
			method: 'POST',
			body,
			headers: this.sessionheader
		})).json();

		return data;
	}

	async placeNormalOrder(order: Order) {
		let url = `${this.baseUrl}/orders/1.0/order/normal`;
		let body = JSON.stringify(order);

		let data = await (await fetch(url, {
			method: 'POST',
			body,
			headers: this.sessionheader
		})).json();

		return data;
	}

	async modifyOrder(order: Order) {
		let url = `${this.baseUrl}/orders/1.0/order`;

		if (!order.orderId) throw new Error('Order Id not found');
		let body = JSON.stringify(order);

		let data = await (await fetch(url, {
			method: 'PUT',
			body,
			headers: this.sessionheader
		})).json();

		return data;
	}

	async cancelOrder(orderId: string) {
		let url = `${this.baseUrl}/orders/1.0/order/${orderId}`;
		let data = await (await fetch(url, {
			method: 'DELETE',
			headers: this.sessionheader
		})).json();

		return data;
	}

	async getTodaysPosition() {
		let url = `${this.baseUrl}/positions/1.0/positions/todays`;
		let data = await (await fetch(url, {
			method: 'GET',
			headers: this.sessionheader
		})).json();

		return data;
	}

	async getOpenPosition() {
		let url = `${this.baseUrl}/positions/1.0/positions/open`;
		let data = await (await fetch(url, {
			method: 'GET',
			headers: this.sessionheader
		})).json();

		return data;
	}

	async getStocksPosition() {
		let url = `${this.baseUrl}/positions/1.0/positions/stocks`;
		let data = await (await fetch(url, {
			method: 'GET',
			headers: this.sessionheader
		})).json();

		return data;
	}

	async getOrders() {
		let url = `${this.baseUrl}/reports/1.0/orders`;
		let data = await (await fetch(url, {
			method: 'GET',
			headers: this.sessionheader
		})).json();

		return data;
	}

	async getOrderById(orderId: string) {
		let url = `${this.baseUrl}/reports/1.0/orders/${orderId}`;
		let data = await (await fetch(url, {
			method: 'GET',
			headers: this.sessionheader
		})).json();

		return data;
	}

	async getTrades() {
		let url = `${this.baseUrl}/reports/1.0/trades`;
		let data = await (await fetch(url, {
			method: 'GET',
			headers: this.sessionheader
		})).json();

		return data;
	}

	async getTradeById(orderId: string) {
		let url = `${this.baseUrl}/reports/1.0/trades/${orderId}`;
		let data = await (await fetch(url, {
			method: 'GET',
			headers: this.sessionheader
		})).json();

		return data;
	}

	async getQuote(instrumentId: string) {
		let url = `${this.baseUrl}/quotes/v1.0/instruments/${instrumentId}`;
		let data = await (await fetch(url, {
			method: 'GET',
			headers: this.sessionheader
		})).json();

		return data;
	}

	async getQuoteLTP(instrumentId: string) {
		let url = `${this.baseUrl}/quotes/v1.0/ltp/instruments/${instrumentId}`;
		let data = await (await fetch(url, {
			method: 'GET',
			headers: this.sessionheader
		})).json();

		return data;
	}

	async getQuoteDepth(instrumentId: string) {
		let url = `${this.baseUrl}/quotes/v1.0/depth/instruments/${instrumentId}`;
		let data = await (await fetch(url, {
			method: 'GET',
			headers: this.sessionheader
		})).json();

		return data;
	}

	async getQuoteOhlc(instrumentId: string) {
		let url = `${this.baseUrl}/quotes/v1.0/ohlc/instruments/${instrumentId}`;
		let data = await (await fetch(url, {
			method: 'GET',
			headers: this.sessionheader
		})).json();

		return data;
	}

}

export default KotakSecurityClient;
