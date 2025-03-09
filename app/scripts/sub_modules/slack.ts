import browser from "webextension-polyfill";
import { reloadContextMenu } from "./contextmenu";
import { getWorkspaces, setWorkspaces } from "./storage";
import {
	getBase64Image,
	httpGet,
	httpPostForm,
	notif,
	notifError,
} from "./util";

export const addEmojiToWorkspace = async (
	imageUrl: string | null,
	workspaceName: string | null,
	emojiName: string | null,
): Promise<void> => {
	if (!imageUrl || !workspaceName || !emojiName) {
		await notifError(
			`imageUrl: ${imageUrl}, workspaceName: ${workspaceName}, emojiName: ${emojiName}`,
		);
		return;
	}

	const sessionInfo = await getSessionInfo(workspaceName);
	if (!sessionInfo) {
		openLoginForm(workspaceName);
		return;
	}

	const workspaces = await getWorkspaces();
	if (!workspaces.includes(workspaceName)) {
		workspaces.push(workspaceName);
		await setWorkspaces(workspaces);
		reloadContextMenu();
	}

	let base64image = new Blob();
	try {
		base64image = await getBase64Image(imageUrl);
	} catch (e) {
		await browser.tabs.create({
			url: imageUrl,
		});
		await notif(browser.i18n.getMessage("fetchImageFailBody"));
		console.error(e);
		return;
	}

	try {
		const formData = {
			mode: "data",
			name: emojiName.replace(":", ""),
			image: base64image,
			token: sessionInfo.api_token,
		};
		const response = await httpPostForm(
			uploadEmojiApiUrl(sessionInfo),
			formData,
		);
		if (!response.ok || !(await response.json()).ok) {
			notif(browser.i18n.getMessage("registrationFailBody"));
			return;
		}
	} catch (e) {
		await notifError(`${e}`);
		return;
	}

	const notifyMessage = browser.i18n.getMessage("registrationSuccessBody", [
		emojiName,
		workspaceName,
	]);
	await notif(notifyMessage, imageUrl);
};

export interface SessionInfo {
	api_token: string;
	version_uid: string;
	version_ts: string;
}

export const getSessionInfo = async (
	workspaceName: string,
): Promise<SessionInfo | undefined> => {
	const emojiCustomizeUrl = `https://${workspaceName}.slack.com/customize/emoji`;
	const response = await httpGet(emojiCustomizeUrl);
	console.log(response.url, emojiCustomizeUrl);
	if (response.url !== emojiCustomizeUrl) {
		return;
	}

	const responseText = await response.text();

	const apiTokenMatches = responseText.match(/"api_token":"(.+?)"/);
	if (!apiTokenMatches || !apiTokenMatches[1]) {
		return;
	}

	const versionUidMatches = responseText.match(/"version_uid":"(.+?)"/);
	if (!versionUidMatches || !versionUidMatches[1]) {
		return;
	}

	const versionTsMatches = responseText.match(/"version_ts":([0-9]+?),/);
	if (!versionTsMatches || !versionTsMatches[1]) {
		return;
	}

	return {
		api_token: apiTokenMatches[1],
		version_uid: versionUidMatches[1],
		version_ts: versionTsMatches[1],
	};
};

export const openLoginForm = (workspaceName: string) => {
	notif(browser.i18n.getMessage("requestLogin", [workspaceName]));
	browser.tabs.create({
		url: `https://${workspaceName}.slack.com`,
	});
};

const getXId = (sessionInfo: SessionInfo): string => {
	const versionUidTop = sessionInfo.version_uid.substr(0, 8);
	return `${versionUidTop}-${Date.now() / 1000}`;
};

const uploadEmojiApiUrl = (sessionInfo: SessionInfo) => {
	return `https://emoji-api.slack.com/api/emoji.add?_x_id=${getXId(sessionInfo)}`;
};
