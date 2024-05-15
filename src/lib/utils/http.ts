import { urls, corsMode } from '$lib/configs/settings';
import { storeAccessToken, storeLocal } from '$lib/stores/storeLocal';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { showToast } from '$lib/components/toasts/toast';
import { clearUserData } from './wallet';
import { storeUserInfo, type IUserInfo } from '$lib/stores/storeUser';
import { t } from '$lib/i18n';

export const api = async (method: string, resource: string, data?: any) => {
	let resp: any;
	try {
		const queryString: string =
			data && method == 'GET'
				? '?' +
				  Object.keys(data)
						.map((key) => key + '=' + data[key])
						.join('&')
				: '';

		const response = await fetch(`${urls.apiBase}${resource}${queryString}`, {
			method,
			// mode: 'no-cors',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: method !== 'GET' ? data && JSON.stringify(data) : null
		}).then(async (response) => {
			resp = await response.json();
			// console.log(resp)
			if (resp.code == 403) {
				tokenExpiredAction();
			}
		});
		return resp;
	} catch (err) {
		// console.log('error', err);
		return false;
	}
};

const clearAllStorageData = () => {
	storeAccessToken.set({
		nickname: '',
		account_id: '',
		username: '',
		role: '',
		access_token: '',
		expires_in: 0,
		expired: 0,
		refresh_token: 0,
		token_type: 0,
		tabIndex: 0
	});
}

export const apiWithToken = async (method: string, resource: string, data?: any) => {
	const tokenApi = get(storeAccessToken);
	let returnData: any;
	if (tokenApi.access_token) {
		const queryString: string =
			data && method == 'GET'
				? '?' +
					Object.keys(data)
						.map((key) => key + '=' + data[key])
						.join('&')
				: '';

		await fetch(`${urls.apiBase}${resource}${queryString}`, {
			method,
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${tokenApi.access_token}`,
				'Content-Type': 'application/json'
			},
			body: method !== 'GET' ? data && JSON.stringify(data) : null
		})
			.then(async (response) => {
				returnData = await response.json();
				if (returnData.code == 403) {
					tokenExpiredAction();
				} else if (returnData.code === 500 || returnData.data === '901') {
					clearUserData();
					goto('/');
					showToast(t.get('common.toast.login_expired'), 'red');
				}
			})
			.catch((e) => {
				// console.log('info', `${urls.apiBase}${resource}${queryString}`);
				// console.log('error', e.message);
			});

		return returnData;
	}
};


export const downloadWithToken = async (targetFilename: string, resource: string, data?: any) => {
	const tokenApi = get(storeAccessToken);
	const method = 'POST';

	if (tokenApi.access_token) {
		// const queryString: string =
		// 	data && method == 'GET'
		// 		? '?' +
		// 		  Object.keys(data)
		// 				.map((key) => key + '=' + data[key])
		// 				.join('&')
		// 		: '';
		// console.log(data);

		// await fetch(`${urls.apiBase}${resource}${queryString}`, {
		await fetch(`${urls.apiBase}${resource}`, {
			method,
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${tokenApi.access_token}`,
				'Content-Type': 'application/json'
			},
			// body: method !== 'GET' ? data && JSON.stringify(data) : null
			body: data && JSON.stringify(data)
		})
			.then((response) => {
				if (response.ok) {
					return response.blob();
				}
				throw new Error('Network response was not ok.');
			})
			.then((blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', targetFilename);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			})
			.catch((e) => {
				console.log('info', `${urls.apiBase}${resource}`);
				console.log('error', e.message);
			});
	}
};

export const uploadWithToken = async (method: string, resource: string, data?: any) => {
	const tokenApi = get(storeAccessToken);
	let returnData: any;
	if (tokenApi.access_token) {
		await fetch(`${urls.apiBase}${resource}`, {
			method,
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${tokenApi.access_token}`
			},
			body: data
		})
			.then(async (response) => {
				returnData = await response.json();
				if (returnData.code == 403) {
					tokenExpiredAction();
				}
			})
			.catch((e) => {
				console.log('info', `${urls.apiBase}${resource}`);
				console.log('error', e.message);
			});

		return returnData;
	}
};

export const parseJwt = (token: any) => {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);
	return JSON.parse(jsonPayload);
};

export const checkTokenExpiry = async () => {
	const token = get(storeAccessToken).access_token;
	const now = Date.now();
	let checkExpiry: any;

	if (token !== '') {
		storeUserInfo.update((item: any): IUserInfo => {
			return {
				...item,
				userid: parseJwt(token).extend.id
			};
		});

		if (get(storeAccessToken).expires_in !== 0 && now >= get(storeAccessToken).expires_in) {
			checkExpiry = setInterval(() => {
				showToast(t.get('common.toast.token_expired'), 'orange');
				clearInterval(checkExpiry);
				clearUserData();
				goto('/');
			}, 10000);
		}
	} else {
		clearInterval(checkExpiry);
	}
};

const tokenExpiredAction = async () => {
	const res = await apiWithToken('POST', '/auth/logout');
	if (res.code == 0) {
		clearUserData()
		goto('/login');
		// showToast('Token Expired, Please re-login', 'primary');
		return false;
	}
};
