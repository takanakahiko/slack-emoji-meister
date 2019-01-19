// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import { getSessionInfo, openLoginForm, uploadEmoji } from './sub_modules/slack'

const addEmojiToTeam = async (imageUrl: string | undefined, givenTeamName?: string) => {
  if (!imageUrl) {
    return
  }
  const teamName = givenTeamName || prompt(chrome.i18n.getMessage('promptTeamName'))
  if (!teamName) {
    return
  }
  const sessionInfo = await getSessionInfo(teamName)
  if (!sessionInfo) {
    return openLoginForm(teamName)
  }
  const emojiName = prompt(chrome.i18n.getMessage('promptEmojiName'))
  if (!emojiName) {
    return
  }
  try {
    await uploadEmoji(teamName, emojiName, imageUrl, sessionInfo)
  } catch (e) {
    console.error(e)
    return
  }
  try {
    chrome.notifications.create(`success-${Math.random()}`, {
      type: 'basic',
      title: chrome.i18n.getMessage('registrationSuccessTitle'),
      message: chrome.i18n.getMessage('registrationSuccessBody', [emojiName, teamName]),
      iconUrl: imageUrl,
    })
    return { teamName, emojiName, imageUrl, sessionInfo }
  } catch (e) {
    // For non-chrome browsers
    new Notification(chrome.i18n.getMessage('registrationSuccessTitle'), {
      body: chrome.i18n.getMessage('registrationSuccessBody', [emojiName, teamName]),
      image: imageUrl,
    })
  }
}

const reloadContextMenu = () => {
  chrome.storage.sync.get(['teams'], (storageGetResult) => {
    chrome.contextMenus.removeAll()
    const id = chrome.contextMenus.create({
      title: chrome.i18n.getMessage('contextMenuTitle'),
      contexts: ['image'],
    })

    const teams: string[] = storageGetResult.teams || []

    for (const team of teams) {
      chrome.contextMenus.create({
        title: chrome.i18n.getMessage('contextMenuTitleForAddEmojiToExistingTeam', [team]),
        contexts: ['image'],
        parentId: id,
        onclick(info) {
          addEmojiToTeam(info.srcUrl, team)
        },
      })
    }

    chrome.contextMenus.create({
      title: chrome.i18n.getMessage('contextMenuTitleForAddEmojiToNewTeam'),
      contexts: ['image'],
      parentId: id,
      async onclick(info) {
        const result = await addEmojiToTeam(info.srcUrl)
        if (result && !teams.includes(result.teamName)) {
          teams.push(result.teamName)
          chrome.storage.sync.set({ teams }, () => {
            reloadContextMenu()
          })
        }
      },
    })
  })
}

chrome.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
  reloadContextMenu()
})

console.log('backgound')
