import * as ls from './types';
import * as api from './models';
import { toSpan } from './transform';
import { hexToDec } from './utils';
import { ReadableSpan } from '@opentelemetry/tracing';

export function createReportRequest(
  runtimeGUID: string,
  accessToken: string,
  reporterTags: { [key: string]: any },
  spans: ReadableSpan[]
): ls.ReportRequest {
  const attributes = {
    ...reporterTags,
    ...spans[0].resource.labels,
  };
  const reporter = new api.Reporter({
    reporterId: hexToDec(runtimeGUID),
    tags: Object.keys(attributes).map(
      key => new api.KeyValue({ key, value: attributes[key] })
    ),
  });

  return new api.ReportRequest({
    auth: new api.Auth({ accessToken }),
    reporter,
    spans: spans.map(toSpan),
    timestampOffsetMicros: '0',
  });
}
