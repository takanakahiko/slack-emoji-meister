import browser from "webextension-polyfill";

export const setWorkspaces = async (workspaces: string[]) => {
	await browser.storage.sync.set({ workspaces });
};

export const getWorkspaces = async (): Promise<string[]> => {
	const storageGetResult = await browser.storage.sync.get("workspaces");
	return (storageGetResult.workspaces as string[]) || [];
};
