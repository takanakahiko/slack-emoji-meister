import { reloadContextMenu } from './sub_modules/contextmenu'

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
  reloadContextMenu()
})

browser.runtime.onMessage.addListener((request)=>{
  if(request==='reloadContextMenu'){
    reloadContextMenu()
  }
})

console.log('backgound')
