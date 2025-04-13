import { addEmojiToWorkspace } from "@/utils/slack";
import { getWorkspaces } from "@/utils/storage";
import { browser } from "wxt/browser";
import type { Menus, Tabs } from "wxt/browser";

// background から prompt を使ってユーザー入力を取得する無理矢理な実装
function getUserInputFromActiveTab(tabId: number, message: string) {
	return browser.scripting
		.executeScript({
			target: { tabId },
			func: (m: string) => {
				const userInput = window.prompt(m);
				return userInput;
			},
			args: [message],
		})
		.then((results) => {
			const result = results[0]?.result;
			if (result !== null && result !== undefined) {
				return result as string;
			}
			return null;
		});
}

browser.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId.toString().startsWith("addemoji-")) {
		AddEmojiListener(info, tab);
	}
});

const AddEmojiListener = async (
	info: Menus.OnClickData,
	tab: Tabs.Tab | undefined,
) => {
	if (info.srcUrl === undefined || tab?.id === undefined) {
		return;
	}
	const workspace =
		info.menuItemId.toString() === "addemoji-[new-work-space]"
			? await getUserInputFromActiveTab(
					tab.id,
					browser.i18n.getMessage("promptWorkspaceName"),
				)
			: info.menuItemId.toString().replace("addemoji-", "");
	const emojiName = await getUserInputFromActiveTab(
		tab.id,
		browser.i18n.getMessage("promptEmojiName"),
	);
	if (emojiName === null) {
		return;
	}
	addEmojiToWorkspace(info.srcUrl, workspace, emojiName);
};

export const reloadContextMenu = async () => {
	const workspaces = await getWorkspaces();

	browser.contextMenus.removeAll();
	const id = browser.contextMenus.create({
		id: Math.random().toString(32).substring(2),
		title: browser.i18n.getMessage("contextMenuTitle"),
		contexts: ["image"],
	});

	for (const workspace of workspaces) {
		browser.contextMenus.create({
			id: `addemoji-${workspace}`,
			title: browser.i18n.getMessage(
				"contextMenuTitleForAddEmojiToExistingWorkspace",
				[workspace],
			),
			contexts: ["image"],
			parentId: id,
		});
	}

	browser.contextMenus.create({
		id: "addemoji-[new-work-space]",
		title: browser.i18n.getMessage("contextMenuTitleForAddEmojiToNewWorkspace"),
		contexts: ["image"],
		parentId: id,
	});
};
