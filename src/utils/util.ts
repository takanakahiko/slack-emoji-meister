import { browser } from "wxt/browser";

interface Headers {
	[s: string]: string;
}
interface Data {
	[s: string]: string | Blob;
}

export const httpGet = async (url: string, headers: Headers = {}) => {
	return fetch(url, {
		headers,
		credentials: "include",
	});
};

export const httpPostForm = async (
	url: string,
	data: Data,
	headers: Headers = {},
) => {
	const formData = new FormData();
	for (const key of Object.keys(data)) {
		formData.append(key, data[key]);
	}
	return fetch(url, {
		method: "POST",
		headers,
		credentials: "include",
		body: formData,
	});
};

export const getBase64Image = async (url: string): Promise<Blob> => {
	return (await fetch(url)).blob();
};

const convertBlobToBase64 = (blob: Blob) => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = reject;
		reader.onload = () => resolve(reader.result as string);
		reader.readAsDataURL(blob);
	});
};

export const notif = async (message: string, imageUrl?: string) => {
	const blob = await getBase64Image(
		imageUrl || browser.runtime.getURL("/icon/icon-128.png"),
	);
	await browser.notifications.create(`${Math.random()}`, {
		type: "basic",
		title: browser.runtime.getManifest().name,
		message,
		iconUrl: await convertBlobToBase64(blob),
	});
};

export const notifError = async (message: string) => {
	await notif(
		`${browser.i18n.getMessage("error")} : ${message}`,
		browser.runtime.getURL("/icon/icon-128.png"),
	);
	console.error(message);
};

export const isChrome = () => {
	return process.env.VENDOR === "chrome";
};

export const isFirefox = () => {
	return process.env.VENDOR === "firefox";
};
