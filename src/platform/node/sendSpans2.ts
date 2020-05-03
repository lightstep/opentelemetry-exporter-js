import * as http from 'http';
import * as https from 'https';

import { IncomingMessage } from 'http';
import * as url from 'url';

/**
 *
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
  const parsedUrl = url.parse(urlToSend);
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'application/json',
      'LightStep-Access-Token': accessToken,
    },
  };

  const request = parsedUrl.protocol === 'http:' ? http.request : https.request;
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
}
