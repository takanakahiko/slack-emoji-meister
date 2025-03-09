import browser from "webextension-polyfill";
import { reloadContextMenu } from "./sub_modules/contextmenu";
import { notifError } from "./sub_modules/util";

const init = () => {
	reloadContextMenu();
};

browser.runtime.onInstalled.addListener((details) => {
	console.log("previousVersion", details.previousVersion);
	init();
});

browser.runtime.onMessage.addListener((message) => {
	if (typeof message !== "string") {
		notifError("message must be string");
		return undefined;
	}
	if (message === "reloadContextMenu") {
		reloadContextMenu();
	}
});

init();

console.log("backgound");
