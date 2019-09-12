import { addEmojiToWorkspace } from './slack'

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
        onclick(info) {
          addEmojiToWorkspace(info.srcUrl!, workspace)
        },
      })
    }

    browser.contextMenus.create({
      title: browser.i18n.getMessage('contextMenuTitleForAddEmojiToNewWorkspace'),
      contexts: ['image'],
      parentId: id,
      async onclick(info) {
        const result = await addEmojiToWorkspace(info.srcUrl!)
        if (result && !workspaces.includes(result.workspaceName)) {
          workspaces.push(result.workspaceName)
          browser.storage.sync.set({ workspaces }).then(() => {
            reloadContextMenu()
          })
        }
      },
    })
  })
}
