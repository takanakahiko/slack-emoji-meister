import browser from "webextension-polyfill";
import { getWorkspaces, setWorkspaces } from "./sub_modules/storage";

let workspaces: string[] = [];

async function remove(name: string) {
	workspaces = workspaces.filter((v) => v !== name);
	await setWorkspaces(workspaces);
	reload();
	browser.runtime.sendMessage("reloadContextMenu");
}

async function reload() {
	workspaces = await getWorkspaces();

	const listElement = document.getElementById("workspaces");
	if (!listElement) return;
	while (listElement.lastChild) {
		listElement.removeChild(listElement.lastChild);
	}

	for (const workspace of workspaces) {
		const li = document.createElement("li");

		const span = document.createElement("span");
		span.innerText = `${workspace}.slack.com`;
		span.style.marginRight = "10px";
		li.appendChild(span);

		const a = document.createElement("input");
		a.value = "Delete";
		a.type = "button";
		a.dataset.name = workspace;
		a.addEventListener("click", (e) => {
			console.log("click");
			const target = e.target as HTMLAnchorElement;
			if (!target) return;
			remove(target.dataset.name as string);
		});
		li.appendChild(a);

		listElement.appendChild(li);
	}
}

reload();

console.log("options");
