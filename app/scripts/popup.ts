console.log('popup')

const getInput = (id: string) => document.getElementById(id) as HTMLInputElement

const setValues = ( imageUrl = '', workspaceName = '' ) => {
    const imageUrlInput = getInput("imageUrl")
    const workspaceNameInput = getInput("workspaceName")
    imageUrlInput.value = imageUrl
    workspaceNameInput.value = workspaceName

    if(imageUrl == "") imageUrlInput.focus()
    else if(workspaceName == "") workspaceNameInput.focus()
    else getInput("emojiName").focus()
}

const onSubmit = (e:Event) => {
    e.preventDefault()
    const message = {
        type: 'addSlackEmoji',
        args: {
            imageUrl : getInput("imageUrl").value,
            workspaceName : getInput("workspaceName").value,
            emojiName : getInput("emojiName").value
        }
    }
    browser.runtime.sendMessage(message); 
    close();
}

const init = () => {
    setValues('', '')
    browser.storage.onChanged.addListener(changes => setValues(changes.imageUrl.newValue, changes.workspaceName.newValue))
    browser.storage.local.get("imageUrl").then(strage => setValues(strage.imageUrl, strage.workspaceName))
    document.getElementById('form')?.addEventListener('submit', onSubmit)
}

window.onload = init
