import { addEmojiToWorkspace } from './slack'
import { isChrome, isFirefox } from './util'

export const reloadContextMenu = () => {
  browser.storage.sync.get(['workspaces']).then((storageGetResult) => {
    browser.contextMenus.removeAll()
    const id = browser.contextMenus.create({
      title: browser.i18n.getMessage('contextMenuTitle'),
      contexts: ['image'],
    })

    const workspaces: string[] = storageGetResult.workspaces || []

    for (const workspace of workspaces) {
      browser.contextMenus.create({
        title: browser.i18n.getMessage('contextMenuTitleForAddEmojiToExistingWorkspace', [workspace]),
        contexts: ['image'],
        parentId: id,
        async onclick(info) {
          if(isChrome()){
            const emojiName = prompt(browser.i18n.getMessage('promptEmojiName'))
            addEmojiToWorkspace(info.srcUrl!, workspace, emojiName)
          }
          else if(isFirefox()){
            await browser.browserAction.openPopup() // This method is only available in firefox
            await browser.storage.local.set({
              workspaceName: workspace,
              imageUrl: info.srcUrl
            })
          }
        },
      })
    }

    browser.contextMenus.create({
      title: browser.i18n.getMessage('contextMenuTitleForAddEmojiToNewWorkspace'),
      contexts: ['image'],
      parentId: id,
      async onclick(info) {
        if(isChrome()){
          const workspaceName = prompt(browser.i18n.getMessage('promptWorkspaceName'))
          const emojiName = prompt(browser.i18n.getMessage('promptEmojiName'))
          await addEmojiToWorkspace(info.srcUrl!, workspaceName, emojiName)
        }
        else if(isFirefox()){
          await browser.browserAction.openPopup() // This method is only available in firefox
          await browser.storage.local.set({
            workspaceName: '',
            imageUrl: info.srcUrl
          })
        }
      },
    })
  })
}
