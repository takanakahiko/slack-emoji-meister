interface Headers {
  [s: string]: string
}
interface Data {
  [s: string]: string | Blob
}

export const httpGet = async (url: string, headers: Headers = {}) => {
  return fetch(url, {
    headers,
    credentials: 'include',
  })
}

export const httpPostForm = async (
  url: string,
  data: Data,
  headers: Headers = {},
) => {
  const formData = new FormData()
  for (const key of Object.keys(data)) {
    formData.append(key, data[key])
  }

  return fetch(url, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: formData,
  })
}

export const getBase64Image = async (url: string): Promise<Blob> => {
  return (await fetch(url)).blob()
}

export const notif = (
  title: string,
  message: string,
  imageUrl?: string,
) => {
  try {
    chrome.notifications.create(`${Math.random()}`, {
      type: 'basic',
      title,
      message,
      iconUrl: imageUrl,
    })
  } catch (e) {
    // For non-chrome browsers
    const _ = new Notification(title, {
      body: message,
      image: imageUrl,
    })
  }
}
