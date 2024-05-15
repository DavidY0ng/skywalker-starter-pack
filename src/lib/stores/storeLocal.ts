import { persisted } from 'svelte-persisted-store'
import { zeroAddress, type Address } from 'viem';

interface IAccessToken {
	account_id: string;
	username: string;
	nickname: string;
	role: string;
	access_token: string;
	expires_in: 0;
	expired: 0;
	refresh_token: 0;
	token_type: 0;
}

interface IStoreLocal {
	theme: string;
	path: string;
	pathId: number;
	lang: 'zh' | 'en';
	alwaysLogin: boolean;
}

export const emptyAccessToken: IAccessToken = {
	account_id: '',
	username: 'guest',
	nickname: 'guest',
	role: 'visitor',
	access_token: '',
	expires_in: 0,
	expired: 0,
	refresh_token: 0,
	token_type: 0,
};

export const emptyData: IStoreLocal = {
	theme: 'day',
	path: '/',
	pathId: 3,
	lang: 'en',
	alwaysLogin: false,
	
};

export const storeAccessToken = persisted<IAccessToken>('storeAccessToken', emptyAccessToken);
export const storeLocal = persisted<IStoreLocal>('storeLocal', emptyData);

// custom
export const storeIntroducer = persisted<any>('storeIntroducer', '');

export type { IStoreLocal };
export type { IAccessToken }
