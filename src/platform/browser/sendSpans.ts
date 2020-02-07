/**
 * @param buffer
 * @param urlToSend
 * @param onSuccess
 * @param onError
 */
export function sendSpans(
  buffer: Uint8Array,
  urlToSend: string,
  onSuccess: () => void,
  onError: (status?: number) => void
) {
  if (typeof navigator.sendBeacon !== 'function') {
    sendSpansWithBeacon(buffer, urlToSend, onSuccess, onError);
  } else {
    sendSpansWithXhr(buffer, urlToSend, onSuccess, onError);
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
  buffer: Uint8Array,
  urlToSend: string,
  onSuccess: () => void,
  onError: (status?: number) => void
) {
  if (navigator.sendBeacon(urlToSend, buffer)) {
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
  buffer: Uint8Array,
  urlToSend: string,
  onSuccess: () => void,
  onError: (status?: number) => void
) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'arraybuffer';
  xhr.open('POST', urlToSend);
  xhr.setRequestHeader('Accept', 'application/octet-stream');
  xhr.setRequestHeader('Content-Type', 'application/octet-stream');

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status >= 200 && xhr.status <= 299) {
        onSuccess();
      } else {
        onError(xhr.status);
      }
    }
  };
  xhr.send(buffer);
}
