import { reloadContextMenu } from './sub_modules/contextmenu'
import { addEmojiToWorkspace } from './sub_modules/slack'

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
  reloadContextMenu()
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

reloadContextMenu()

console.log('backgound')
