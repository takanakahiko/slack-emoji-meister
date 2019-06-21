import { reloadContextMenu } from './sub_modules/contextmenu'

chrome.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
  reloadContextMenu()
})

chrome.runtime.onMessage.addListener((request)=>{
  if(request==='reloadContextMenu'){
    reloadContextMenu()
  }
})

console.log('backgound')
