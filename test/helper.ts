import { TraceFlags } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { ReadableSpan } from '@opentelemetry/tracing';
import * as assert from 'assert';

export const spanWithoutParent: ReadableSpan = {
  name: 'test1',
  kind: 0,
  spanContext: {
    traceId: '123',
    spanId: '456',
    traceFlags: TraceFlags.SAMPLED,
  },
  startTime: [123, 456000000],
  endTime: [124, 500000000],
  status: {
    code: 1,
  },
  attributes: {
    atr1: 'val1',
    atr2: 'val2',
  },
  links: [
    {
      context: {
        traceId: '111',
        spanId: '222',
      },
    },
  ],
  events: [
    {
      attributes: {
        foo: 'bla',
      },
      name: 'foo',
      time: [123, 555000000],
    },
  ],
  duration: [1, 44000000],
  ended: true,
  resource: Resource.empty(),
};

export const spanWithParent: ReadableSpan = Object.assign(
  {},
  spanWithoutParent,
  {
    parentSpanId: '222',
  }
);

export const spanJSON =
  '{"spanContext":{"traceId":"","spanId":"1110"},"operationName":"test1","references":[{"relationship":"FOLLOWS_FROM","spanContext":{"traceId":"","spanId":"546"}}],"startTimestamp":"1970-01-01T00:02:03.456Z","durationMicros":"1044000","tags":[{"key":"atr1","stringValue":"val1"},{"key":"atr2","stringValue":"val2"}],"logs":[{"timestamp":"1970-01-01T00:02:03.555Z","fields":[{"key":"foo","stringValue":"bla"},{"key":"event","stringValue":"foo"}]}]}';
export const spanWithParentJSON =
  '{"spanContext":{"traceId":"","spanId":"1110"},"operationName":"test1","references":[{"relationship":"CHILD_OF","spanContext":{"traceId":"","spanId":"546"}},{"relationship":"CHILD_OF","spanContext":{"traceId":"","spanId":"546"}}],"startTimestamp":"1970-01-01T00:02:03.456Z","durationMicros":"1044000","tags":[{"key":"atr1","stringValue":"val1"},{"key":"atr2","stringValue":"val2"}],"logs":[{"timestamp":"1970-01-01T00:02:03.555Z","fields":[{"key":"foo","stringValue":"bla"},{"key":"event","stringValue":"foo"}]}]}';
export const reportJSON =
  '{"reporter":{"reporterId":"1311862288733744077","tags":[{"key":"foo","stringValue":"bar"}]},"auth":{"accessToken":"dkasjdalsjdlaksjdkaskldj"},"spans":[{"spanContext":{"traceId":"","spanId":"1110"},"operationName":"test1","references":[{"relationship":"CHILD_OF","spanContext":{"traceId":"","spanId":"546"}},{"relationship":"CHILD_OF","spanContext":{"traceId":"","spanId":"546"}}],"startTimestamp":"1970-01-01T00:02:03.456Z","durationMicros":"1044000","tags":[{"key":"atr1","stringValue":"val1"},{"key":"atr2","stringValue":"val2"}],"logs":[{"timestamp":"1970-01-01T00:02:03.555Z","fields":[{"key":"foo","stringValue":"bla"},{"key":"event","stringValue":"foo"}]}]}],"timestampOffsetMicros":"0"}';

export const assertValidPostBody = (body: string) => {
  const result = JSON.parse(body);
  assert.strictEqual(result.auth.accessToken, 'abc');
  assert.ok(result.spans.length === 1);
  assert.strictEqual(result.spans[0].operationName, 'test1');
};
