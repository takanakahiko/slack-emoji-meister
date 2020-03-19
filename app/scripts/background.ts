import { reloadContextMenu } from './sub_modules/contextmenu'
import { addEmojiToWorkspace } from './sub_modules/slack'

const init = () => {
  reloadContextMenu()
  browser.storage.local.set({
    workspaceNam: "",
    imageUrl: "",
  })
}

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
  init()
})

browser.runtime.onMessage.addListener((request)=>{
  if(request==='reloadContextMenu'){
    reloadContextMenu()
  }
  if(request.type==='addSlackEmoji'){
    const args = request.args
    addEmojiToWorkspace(args.imageUrl, args.workspaceName, args.emojiName)
  }
})

init()

console.log('backgound')
