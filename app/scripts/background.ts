// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import {
  getSessionInfo,
  openLoginForm,
  uploadEmoji
} from './sub_modules/slack'

const onClickContextMenus = async (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
  if( !info.srcUrl ) return;
  const image_url = info.srcUrl;
  const team_name = prompt(chrome.i18n.getMessage('promptTeamName')) || '';
  const emoji_name = prompt(chrome.i18n.getMessage('promptEmojiName')) || '';
  const session_info = await getSessionInfo(team_name)
  if(!session_info) return openLoginForm(team_name)
  await uploadEmoji(team_name, emoji_name , image_url, session_info)
}

chrome.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion);
  chrome.contextMenus.create({
    title: chrome.i18n.getMessage('contextMenuTitle'),
    contexts: ['image'],
    onclick: onClickContextMenus
  });
});

console.log(`backgound`);
