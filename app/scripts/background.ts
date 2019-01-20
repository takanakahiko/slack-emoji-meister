// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import { getSessionInfo, openLoginForm, uploadEmoji, SessionInfo } from './sub_modules/slack'

interface EmojiAddResult {
  workspaceName: string
  emojiName: string
  imageUrl: string
  sessionInfo: SessionInfo,
}

async function addEmojiToWorkspace(imageUrl: string, givenWorkspaceName?: string): Promise<EmojiAddResult | undefined> {
  if (!imageUrl) {
    return
  }
  const workspaceName = givenWorkspaceName || prompt(chrome.i18n.getMessage('promptWorkspaceName'))
  if (!workspaceName) {
    return
  }
  const sessionInfo = await getSessionInfo(workspaceName)
  if (!sessionInfo) {
    openLoginForm(workspaceName)
    return
  }
  const emojiName = prompt(chrome.i18n.getMessage('promptEmojiName'))
  if (!emojiName) {
    return
  }
  try {
    await uploadEmoji(workspaceName, emojiName, imageUrl, sessionInfo)
  } catch (e) {
    console.error(e)
    return
  }
  try {
    chrome.notifications.create(`success-${Math.random()}`, {
      type: 'basic',
      title: chrome.i18n.getMessage('registrationSuccessTitle'),
      message: chrome.i18n.getMessage('registrationSuccessBody', [emojiName, workspaceName]),
      iconUrl: imageUrl,
    })
  } catch (e) {
    // For non-chrome browsers
    new Notification(chrome.i18n.getMessage('registrationSuccessTitle'), {
      body: chrome.i18n.getMessage('registrationSuccessBody', [emojiName, workspaceName]),
      image: imageUrl,
    })
  }
  return { workspaceName, emojiName, imageUrl, sessionInfo }
}

const reloadContextMenu = () => {
  chrome.storage.sync.get(['workspaces'], (storageGetResult) => {
    chrome.contextMenus.removeAll()
    const id = chrome.contextMenus.create({
      title: chrome.i18n.getMessage('contextMenuTitle'),
      contexts: ['image'],
    })

    const workspaces: string[] = storageGetResult.workspaces || []

    for (const workspace of workspaces) {
      chrome.contextMenus.create({
        title: chrome.i18n.getMessage('contextMenuTitleForAddEmojiToExistingWorkspace', [workspace]),
        contexts: ['image'],
        parentId: id,
        onclick(info) {
          addEmojiToWorkspace(info.srcUrl!, workspace)
        },
      })
    }

    chrome.contextMenus.create({
      title: chrome.i18n.getMessage('contextMenuTitleForAddEmojiToNewWorkspace'),
      contexts: ['image'],
      parentId: id,
      async onclick(info) {
        const result = await addEmojiToWorkspace(info.srcUrl!)
        if (result && !workspaces.includes(result.workspaceName)) {
          workspaces.push(result.workspaceName)
          chrome.storage.sync.set({ workspaces }, () => {
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
