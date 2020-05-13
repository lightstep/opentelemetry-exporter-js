import * as http from 'http';
import * as https from 'https';

import { IncomingMessage } from 'http';
import * as url from 'url';

/**
 * Creates and returns a suitable sendSpans function for browser
 *
 * @param urlToSend
 * @param accessToken
 */
export function sendSpansFn(
  urlToSend: string,
  accessToken?: string
): (
  body: string,
  onSuccess: () => void,
  onError: (status?: number) => void
) => void {
  const parsedUrl = url.parse(urlToSend);
  const headers: { [key: string]: any } = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (accessToken) headers['LightStep-Access-Token'] = accessToken;

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    method: 'POST',
    headers,
  };
  const request = parsedUrl.protocol === 'http:' ? http.request : https.request;

  return function(
    body: string,
    onSuccess: () => void,
    onError: (status?: number) => void
  ) {
    headers['Content-Length'] = Buffer.byteLength(body);

    const req = request(options, (res: IncomingMessage) => {
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
