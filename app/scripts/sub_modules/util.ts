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

const convertBlobToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

export const notif = async (
  title: string,
  message: string,
  imageUrl?: string,
) => {
  let base64image: string|undefined
  if (imageUrl) {
    const blob = await getBase64Image(imageUrl)
    base64image = await convertBlobToBase64(blob)
  }
  await browser.notifications.create(`${Math.random()}`, {
    type: 'basic',
    title,
    message,
    iconUrl: base64image,
  })
}
