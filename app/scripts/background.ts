// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import { getSessionInfo, openLoginForm, uploadEmoji } from './sub_modules/slack'

const onClickContextMenus = async (
  info: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab,
) => {
  if (!info.srcUrl) {
    return
  }
  const imageUrl = info.srcUrl
  const teamName = prompt(chrome.i18n.getMessage('promptTeamName'))
  if (!teamName) {
    return
  }
  const emojiName = prompt(chrome.i18n.getMessage('promptEmojiName'))
  if (!emojiName) {
    return
  }
  const sessionInfo = await getSessionInfo(teamName)
  if (!sessionInfo) {
    return openLoginForm(teamName)
  }
  await uploadEmoji(teamName, emojiName, imageUrl, sessionInfo)
}

chrome.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
  chrome.contextMenus.create({
    title: chrome.i18n.getMessage('contextMenuTitle'),
    contexts: ['image'],
    onclick: onClickContextMenus,
  })
})

console.log('backgound')
