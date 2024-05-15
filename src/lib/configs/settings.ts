export let currentURL: any;

if (typeof window !== 'undefined') {
	currentURL = new URL(window.location.href).hostname;
}

export const urlList = {
	dev: {
		domainURL: 'https://stagingdapp.iwinfund.com/',
		// baseUrl: 'https://stagingcore.iwinfund.com/dapp',
		// apiBase: 'https://stagingcore.iwinfund.com/dapp',
        baseUrl: 'http://192.168.100.111:8767',
		apiBase: 'http://192.168.100.111:8767/dapp',
		wsBase: 'ws://192.168.100.111:7272',
		apiLoginRequest: '/api/auth/request',
		apiLoginVerify: '/api/auth/verify',
		apiUserInfo: '/api/users/info',
		apiEditName: '/dapp/user/editname',
		apiStrategy: '/dapp/user/editname'
	},
	live: {
		domainURL: 'https://dapp.iwinfund.com/',
		baseUrl: 'https://core.iwinfund.com/dapp',
		apiBase: 'https://core.iwinfund.com/dapp',
		wsBase: 'ws://192.168.100.111:7272',
		apiLoginRequest: '/api/auth/request',
		apiLoginVerify: '/api/auth/verify',
		apiUserInfo: '/api/users/info',
		apiEditName: '/dapp/user/editname',
		apiStrategy: '/dapp/user/editname'
	}
};

export const urls =
	currentURL === new URL(urlList.live.domainURL).hostname ? urlList.live : urlList.dev;

export const corsMode = process.env.NODE_ENV == 'development' ? 'no-cors' : 'cors';
