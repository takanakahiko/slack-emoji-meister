import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

import { reloadContextMenu } from "@/utils/contextmenu";
import { notifError } from "@/utils/util";

export default defineBackground(() => {
	const init = () => {
		reloadContextMenu();
	};

	browser.runtime.onInstalled.addListener((details) => {
		console.log("previousVersion", details.previousVersion);
		init();
	});

	browser.runtime.onMessage.addListener((message: unknown) => {
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
});
