import { httpGet, httpPostForm, getBase64Image, notif, notifError } from './util'
import { reloadContextMenu } from './contextmenu'

export const addEmojiToWorkspace = async (
  imageUrl: string | null,
  workspaceName: string | null,
  emojiName: string | null,
): Promise<void> => {
  if (!imageUrl || !workspaceName || !emojiName) {
    await notifError()
    return
  }
  const sessionInfo = await getSessionInfo(workspaceName)
  if (!sessionInfo) {
    openLoginForm(workspaceName)
    return
  }
  try {
    const isSuccess = await uploadEmoji(workspaceName, emojiName, imageUrl, sessionInfo)
    if (!isSuccess) {
      notif(
        browser.i18n.getMessage('registrationFailTitle'),
        browser.i18n.getMessage('registrationFailBody'),
      )
      return
    }
  } catch (e) {
    await notifError()
    console.error(e)
    return
  }
  await notif(
    browser.i18n.getMessage('registrationSuccessTitle'),
    browser.i18n.getMessage('registrationSuccessBody', [emojiName, workspaceName]),
    imageUrl,
  )
  if (!workspaces.includes(workspaceName)) {
    workspaces.push(workspaceName)
    await browser.storage.sync.set({ workspaces })
    reloadContextMenu()
  }
}

export interface SessionInfo {
  api_token: string
  version_uid: string
  version_ts: string
}

export const getSessionInfo = async (
  workspaceName: string,
): Promise<SessionInfo | undefined> => {
  const emojiCustomizeUrl = `https://${workspaceName}.slack.com/customize/emoji`
  const response = await httpGet(emojiCustomizeUrl)
  console.log(response.url, emojiCustomizeUrl)
  if (response.url !== emojiCustomizeUrl) {
    return
  }

  const responseText = await response.text()

  const apiTokenMatches = responseText.match(/"api_token":"(.+?)"/)
  if (!apiTokenMatches || !apiTokenMatches[1]) {
    return
  }

  const versionUidMatches = responseText.match(/"version_uid":"(.+?)"/)
  if (!versionUidMatches || !versionUidMatches[1]) {
    return
  }

  const versionTsMatches = responseText.match(/"version_ts":"([0-9]+?)"/)
  if (!versionTsMatches || !versionTsMatches[1]) {
    return
  }

  return {
    api_token: apiTokenMatches[1],
    version_uid: versionUidMatches[1],
    version_ts: versionTsMatches[1],
  }
}

export const openLoginForm = (workspaceName: string) => {
  notif(
    browser.runtime.getManifest().name,
    browser.i18n.getMessage('requestLogin', [workspaceName]),
  )
  browser.tabs.create({
    url: `https://${workspaceName}.slack.com`,
  })
}

const getXId = (sessionInfo: SessionInfo): string => {
  const versionUidTop = sessionInfo.version_uid.substr(0, 8)
  return `${versionUidTop}-${Date.now() / 1000}`
}

export const uploadEmoji = async (
  workspaceName: string,
  emojiName: string,
  imageUrl: string,
  sessionInfo: SessionInfo,
) => {
  const emojiCustomizeUrl = `https://${workspaceName}.slack.com/api/emoji.add?_x_id=${getXId(
    sessionInfo,
  )}`
  const formData = {
    mode: 'data',
    name: emojiName.replace(':', ''),
    image: await getBase64Image(imageUrl),
    token: sessionInfo.api_token,
  }
  const response = await httpPostForm(emojiCustomizeUrl, formData)
  return response.ok && (await response.json()).ok
}
