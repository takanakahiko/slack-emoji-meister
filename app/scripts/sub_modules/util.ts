export const httpGet = async (url: string, header: { [s: string]: string } = {}): Promise<XMLHttpRequest> => {
  return new Promise<XMLHttpRequest>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = (event) => {
      if (xhr.readyState !== 4) {
        return
      }
      return resolve(xhr) // OK
    }
    xhr.open('GET', url, true) // Async
    Object.keys(header).forEach((key) => {
      xhr.setRequestHeader(key, header[key])
    })
    xhr.withCredentials = true
    xhr.send()
  })
}

export const httpPostForm = async (
  url: string,
  formData: { [s: string]: string | Blob },
  header: { [s: string]: string } = {},
): Promise<XMLHttpRequest> => {
  return new Promise<XMLHttpRequest>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const form = new FormData()
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key])
    })
    xhr.onreadystatechange = (event) => {
      if (xhr.readyState !== 4) {
        return
      }
      return resolve(xhr) // OK
    }
    xhr.open('POST', url, true) // Async
    Object.keys(header).forEach((key) => {
      xhr.setRequestHeader(key, header[key])
    })
    xhr.withCredentials = true
    xhr.send(form)
  })
}

export const getBase64Image = async (url: string): Promise<Blob> => {
  return await fetch(url).then((r) => r.blob())
}
