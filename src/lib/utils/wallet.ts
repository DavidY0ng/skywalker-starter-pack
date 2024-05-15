import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { showToast } from '$lib/components/toasts/toast';
import { currentURL, urlList } from '$lib/configs/settings';
import { t } from '$lib/i18n';
import { api, apiWithToken } from './http';
import { emptyAccessToken, storeAccessToken } from '$lib/stores/storeLocal';
import { emptyUserInfo, storeUserInfo, type IUserInfo } from '$lib/stores/storeUser';
import { get } from 'svelte/store';
import {
	createPublicClient,
	createWalletClient,
	custom,
	http,
	zeroAddress,
	type Address,
	type Chain
} from 'viem';
import { bsc, bscTestnet } from 'viem/chains';

export let walletClient: any;
export let connectedAddress: Address = get(storeUserInfo).address;


let signedMessage: string = '';
let message: string = '';
const targetNetwork: Chain =
	currentURL === new URL(urlList.live.domainURL).hostname ? bsc : bscTestnet;

if (browser && window.ethereum) {
	walletClient = createWalletClient({
		chain: targetNetwork,
		transport: custom(window.ethereum)
	});
}

export const publicClient = createPublicClient({
	chain: targetNetwork,
	transport: http()
});



export const onConnectWallet = async () => {
	try {
		const accounts = await walletClient.requestAddresses({force:true});
		if (accounts) {
			const connectedChainId = await walletClient.getChainId();
			storeUserInfo.update((item: any): IUserInfo => {
				return {
					...item,
					address: accounts[0],
					chainid: connectedChainId
				};
			});
			connectedAddress = get(storeUserInfo).address;
			if (connectedChainId != targetNetwork.id) {
				await walletClient.addChain({ chain: targetNetwork });
				await walletClient.switchChain({ id: targetNetwork.id });
			}
			onRequestSignMessage()
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
};

export const onRequestSignMessage = async () => {
	try {
		if (connectedAddress === zeroAddress) {
			showToast(t.get('common.toast.connect_wallet'), 'red');
			return false;
		} else {
			const req  = await api('GET', `/auth/request`, {
				address: connectedAddress
			});

			const { success, data } = req;

			if (success) {
				message = data;
				signedMessage = await walletClient.signMessage({
					account: connectedAddress,
					message: message
				});
				const result = onVerifySignMessage();

				return result;
			} else {
				showToast(t.get(`common.toast.${data[0]}`), 'red');
				return false;
			}
		}
	} catch (error) {
		throw error;
	}
};

const onVerifySignMessage = async () => {
	try {
		if (!connectedAddress || !message || !signedMessage) {
			showToast(t.get('common.toast.request_sign'), 'red');
			return;
		}

		const res = await api('POST', '/auth/verify', {
			address: connectedAddress,
			sign: signedMessage
		});

		if (!res.success) {
			showToast(t.get('common.toast.verify_sign_failed'), 'red');
		} else {
			storeAccessToken.set({
				...storeAccessToken,
				access_token: res.data.access_token,
				refresh_token: res.data.refresh_token,
				expires_in: new Date().getTime() + res.data.expires_in * 1000
			});

			showToast(t.get('common.toast.login_success'), 'green');
			goto('/trade/BTC');
			return { success: true };
		}
	} catch (error) {
		throw false;
	}
};

export const clearUserData = () => {
	storeAccessToken.set(emptyAccessToken);
	storeUserInfo.set(emptyUserInfo);
};

export const onLogOut = async () => {
	await apiWithToken('POST', '/auth/logout');
	clearUserData();
	goto('/');
};
