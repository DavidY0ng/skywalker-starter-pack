import { writable } from 'svelte/store';

export const toastMsg = writable('');
export const toastColor = writable('');
export const toastState = writable(false);

export const showToast = (msg: string, color: string) => {
	toastColor.set(color);
	toastMsg.set(msg);
	toastState.set(false);
	toastState.set(true);
};
