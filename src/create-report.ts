import * as ls from './types2';
import * as api from './models';
import { toSpan } from './transform2';
import { hexToDec } from './utils';
import { ReadableSpan } from '@opentelemetry/tracing';

export function createReport(
  runtimeGUID: string,
  accessToken: string,
  reporterTags: { [key: string]: any }
): (spans: ReadableSpan[]) => ls.ReportRequest {
  const _runtimeGUID: string = runtimeGUID;
  const _accessToken: string = accessToken;
  const _auth: ls.Auth = new api.Auth({ accessToken: _accessToken });
  const _reporterTags = reporterTags;
  let _reporter: ls.Reporter;

  function setReporter(
    runtimeGUID: string,
    attributes: { [key: string]: any }
  ): ls.Reporter {
    _reporter = new api.Reporter({
      reporterId: hexToDec(runtimeGUID),
      tags: Object.keys(attributes).map(
        (key) => new api.KeyValue({ key: key, value: attributes[key] })
      ),
    });
    return _reporter;
  }

  return function(spans: ReadableSpan[]): ls.ReportRequest {
    return new api.ReportRequest({
      auth: _auth,
      reporter:
        _reporter ||
        setReporter(_runtimeGUID, {
          ..._reporterTags,
          ...spans[0].resource.labels,
        }),
      spans: spans.map(toSpan),
      timestampOffsetMicros: '0',
    });
  };
}
