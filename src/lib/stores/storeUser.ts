import { persisted } from 'svelte-persisted-store';
import { zeroAddress, type Address } from 'viem';

interface IUserInfo {
	address: Address;
	chainid: string;
	userid: string;
	has_address: number;
	is_linked: number;
}

export const emptyUserInfo: IUserInfo = {
	address: zeroAddress,
	chainid: '',
	userid: '',
	has_address: 0,
	is_linked: 0
};

export const storeUserInfo = persisted<IUserInfo>('storeUserInfo', emptyUserInfo);

export type { IUserInfo };
