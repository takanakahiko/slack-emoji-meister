import { defineConfig } from "wxt";

export default defineConfig({
	srcDir: "src",
	imports: false,
	manifest: {
		name: "__MSG_appName__",
		short_name: "__MSG_appShortName__",
		description: "__MSG_appDescription__",
		default_locale: "en",
		permissions: [
			"contextMenus",
			"storage",
			"notifications",
			"activeTab",
			"scripting",
		],
		host_permissions: [
			"https://*.slack.com/customize/emoji",
			"https://*.slack.com/api/emoji.add",
		],
		homepage_url: "https://takanakahiko.github.io/slack-emoji-meister/",
		browser_specific_settings: {
			gecko: {
				id: "{9ED01125-62DA-4FEE-96A2-1871C6876A27}",
			},
		},
	},
});
