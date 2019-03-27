// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import { reloadContextMenu } from './sub_modules/contextmenu'

chrome.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
  reloadContextMenu()
})

console.log('backgound')
