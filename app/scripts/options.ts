let workspaces:string[] = []

function remove(name:string){
  workspaces = workspaces.filter( v => v !== name )
  browser.storage.sync.set({ workspaces }).then(() => {
    reload()
    browser.runtime.sendMessage('reloadContextMenu');
  })
}

function reload(){
  browser.storage.sync.get(['workspaces']).then((storageGetResult) => {
    workspaces = storageGetResult.workspaces || []
    const listElement = document.getElementById('workspaces')
    if(!listElement) return
    while (listElement.lastChild) {
      listElement.removeChild(listElement.lastChild);
    }
    workspaces.forEach((name)=>{
      const li = document.createElement('li')
      const span = document.createElement('span')
      span.innerText = name + '.slack.com'
      const a = document.createElement('a')
      a.href = '#'
      a.innerText = 'x'
      a.dataset.name = name
      a.addEventListener('click',(e)=>{
        console.log("click")
        var target = e.target as HTMLAnchorElement;
        if (!target) return;
        remove(target.dataset.name as string)
      })
      li.appendChild(span)
      li.appendChild(a)
      listElement.appendChild(li)
    })
  })
}

reload()

console.log('options')
