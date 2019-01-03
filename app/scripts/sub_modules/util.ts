export const httpGet = async(
  url: string,
  header: { [s: string]: string } = {}
): Promise<XMLHttpRequest> => {
  return new Promise<XMLHttpRequest>((resolve, _reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (event) {
      if (xhr.readyState !== 4) return;
      return resolve(xhr); // OK
    };
    xhr.open('GET', url, true); // Async
    Object.keys(header).forEach(function (key) {
      xhr.setRequestHeader( key, header[key] );
    });
    xhr.withCredentials = true;
    xhr.send();
  });
};

export const httpPostForm = async(
  url: string,
  form_data: { [s: string]: string | Blob },
  header: { [s: string]: string } = {}
): Promise<XMLHttpRequest> => {
  return new Promise<XMLHttpRequest>((resolve, _reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    Object.keys(form_data).forEach(function (key) {
      form.append(key, form_data[key]);
    });
    xhr.onreadystatechange = function (event) {
      if (xhr.readyState !== 4) return;
      return resolve(xhr); // OK
    };
    xhr.open('POST', url, true); // Async
    Object.keys(header).forEach(function (key) {
      xhr.setRequestHeader( key, header[key] );
    });
    xhr.withCredentials = true;
    xhr.send(form);
  });
};

export const getBase64Image = async(url: string): Promise<Blob> => {
  return await fetch(url).then(r => r.blob());
};