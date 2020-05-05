import * as http from 'http';
import * as https from 'https';

import { IncomingMessage } from 'http';
import * as url from 'url';

/**
 * @param accessToken
 * @param urlToSend
 */
export function sendSpans2(
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
        console.log('probably worked');
        onSuccess();
      } else {
        console.log(req);
        console.log(body);
        console.log('probably failed', res.statusCode, res.statusMessage);
        onError(res.statusCode);
      }
    });

    req.on('error', (error: Error) => {
      console.log('twas an error: ', error);
      onError();
    });
    req.write(body);
    req.end();
  };
}
