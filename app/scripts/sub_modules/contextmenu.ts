import { addEmojiToWorkspace } from './slack'

export const reloadContextMenu = () => {
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
