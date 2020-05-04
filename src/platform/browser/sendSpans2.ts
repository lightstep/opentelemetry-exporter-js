/**
 * @param buffer
 * @param urlToSend
 * @param onSuccess
 * @param onError
 */
export function sendSpans2(
  body: string,
  accessToken: string,
  urlToSend: string,
  onSuccess: () => void,
  onError: (status?: number) => void
) {
  if (typeof navigator.sendBeacon === 'function') {
    sendSpansWithBeacon(body, accessToken, urlToSend, onSuccess, onError);
  } else {
    sendSpansWithXhr(body, accessToken, urlToSend, onSuccess, onError);
  }
}
/**
 *
 * @param buffer
 * @param urlToSend
 * @param onSuccess
 * @param onError
 */
function sendSpansWithBeacon(
  body: string,
  accessToken: string,
  urlToSend: string,
  onSuccess: () => void,
  onError: (status?: number) => void
) {
  if (navigator.sendBeacon(urlToSend, body)) {
    onSuccess();
  } else {
    onError();
  }
}

/**
 *
 * @param buffer
 * @param urlToSend
 * @param onSuccess
 * @param onError
 */
function sendSpansWithXhr(
  body: string,
  accessToken: string,
  urlToSend: string,
  onSuccess: () => void,
  onError: (status?: number) => void
) {
  const xhr = new XMLHttpRequest();
  //xhr.responseType = 'arraybuffer';
  xhr.open('POST', urlToSend);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('LightStep-Access-Token', accessToken);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status >= 200 && xhr.status <= 299) {
        onSuccess();
      } else {
        onError(xhr.status);
      }
    }
  };
  xhr.send(body);
}