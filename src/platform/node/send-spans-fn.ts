import * as http from 'http';
import * as https from 'https';

import { IncomingMessage } from 'http';
import * as url from 'url';

/**
 * Creates and returns a suitable sendSpans function for browser
 *
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
  const _parsedUrl = url.parse(urlToSend);
  const _headers: { [key: string]: any } = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'LightStep-Access-Token': accessToken,
  };
  const _options = {
    hostname: _parsedUrl.hostname,
    port: _parsedUrl.port,
    path: _parsedUrl.path,
    method: 'POST',
    headers: _headers,
  };
  const request =
    _parsedUrl.protocol === 'http:' ? http.request : https.request;

  return function(
    body: string,
    onSuccess: () => void,
    onError: (status?: number) => void
  ) {
    _headers['Content-Length'] = Buffer.byteLength(body);

    const req = request(_options, (res: IncomingMessage) => {
      if (res.statusCode && res.statusCode < 299) {
        onSuccess();
      } else {
        onError(res.statusCode);
      }
    });

    req.on('error', (error: Error) => {
      onError();
    });
    req.write(body);
    req.end();
  };
}
