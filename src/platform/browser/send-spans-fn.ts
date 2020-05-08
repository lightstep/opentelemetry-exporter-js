/**
 * @param accessToken
 * @param urlToSend
 */
export function sendSpansFn(
  accessToken: string,
  urlToSend: string
): (
  body: string,
  onSuccess: () => void,
  onError: (status?: number) => void
) => void {
  /**
   * @param body
   * @param onSuccess
   * @param onError
   */
  function sendSpansWithBeacon(
    body: string,
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
   * @param body
   * @param onSuccess
   * @param onError
   */
  function sendSpansWithXhr(
    body: string,
    onSuccess: () => void,
    onError: (status?: number) => void
  ) {
    const xhr = new XMLHttpRequest();
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

  return function(
    body: string,
    onSuccess: () => void,
    onError: (status?: number) => void
  ) {
    if (typeof navigator.sendBeacon === 'function') {
      sendSpansWithBeacon(body, onSuccess, onError);
    } else {
      sendSpansWithXhr(body, onSuccess, onError);
    }
  };
}
