import { TraceFlags } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { ReadableSpan } from '@opentelemetry/tracing';
import * as assert from 'assert';

export const spanWithoutParent: ReadableSpan = {
  name: 'test1',
  kind: 0,
  spanContext: {
    traceId: 'a431ce0a337e42c430d5653f35850a9b',
    spanId: '7b6d0677c22ba51c',
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
        traceId: '7dc36f505d42e7d0c4d45a90d79f00b1',
        spanId: '0301fbb96d6ea326',
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
    parentSpanId: '20d8e7972bb89572',
  }
);

export const spanJSON = {
  spanContext: {
    traceId: '3518830006015167131',
    spanId: '8893771950555112732',
  },
  operationName: 'test1',
  references: [
    {
      relationship: 'FOLLOWS_FROM',
      spanContext: {
        traceId: '14183060704635846833',
        spanId: '216731030913983270',
      },
    },
  ],
  startTimestamp: new Date(123456),
  durationMicros: '1044000',
  tags: [
    {
      key: 'atr1',
      stringValue: 'val1',
    },
    {
      key: 'atr2',
      stringValue: 'val2',
    },
  ],
  logs: [
    {
      timestamp: new Date(123555),
      fields: [
        {
          key: 'foo',
          stringValue: 'bla',
        },
        {
          key: 'event',
          stringValue: 'foo',
        },
      ],
    },
  ],
};
export const spanWithParentJSON = {
  spanContext: {
    traceId: '3518830006015167131',
    spanId: '8893771950555112732',
  },
  operationName: 'test1',
  references: [
    {
      relationship: 'CHILD_OF',
      spanContext: {
        traceId: '3518830006015167131',
        spanId: '2366896240642790770',
      },
    },
    {
      relationship: 'FOLLOWS_FROM',
      spanContext: {
        traceId: '14183060704635846833',
        spanId: '216731030913983270',
      },
    },
  ],
  startTimestamp: new Date(123456),
  durationMicros: '1044000',
  tags: [
    {
      key: 'atr1',
      stringValue: 'val1',
    },
    {
      key: 'atr2',
      stringValue: 'val2',
    },
  ],
  logs: [
    {
      timestamp: new Date(123555),
      fields: [
        {
          key: 'foo',
          stringValue: 'bla',
        },
        {
          key: 'event',
          stringValue: 'foo',
        },
      ],
    },
  ],
};

export const reportJSON = {
  reporter: {
    reporterId: '1311862288733744077',
    tags: [
      {
        key: 'foo',
        stringValue: 'bar',
      },
    ],
  },
  auth: {
    accessToken: 'dkasjdalsjdlaksjdkaskldj',
  },
  spans: [
    {
      spanContext: {
        traceId: '3518830006015167131',
        spanId: '8893771950555112732',
      },
      operationName: 'test1',
      references: [
        {
          relationship: 'CHILD_OF',
          spanContext: {
            traceId: '3518830006015167131',
            spanId: '2366896240642790770',
          },
        },
        {
          relationship: 'FOLLOWS_FROM',
          spanContext: {
            traceId: '14183060704635846833',
            spanId: '216731030913983270',
          },
        },
      ],
      startTimestamp: new Date(123456),
      durationMicros: '1044000',
      tags: [
        {
          key: 'atr1',
          stringValue: 'val1',
        },
        {
          key: 'atr2',
          stringValue: 'val2',
        },
      ],
      logs: [
        {
          timestamp: new Date(123555),
          fields: [
            {
              key: 'foo',
              stringValue: 'bla',
            },
            {
              key: 'event',
              stringValue: 'foo',
            },
          ],
        },
      ],
    },
  ],
  timestampOffsetMicros: '0',
};

export const assertValidPostBody = (body: string) => {
  const result = JSON.parse(body);
  assert.strictEqual(result.auth.accessToken, 'abc');
  assert.ok(result.spans.length === 1);
  assert.strictEqual(result.spans[0].operationName, 'test1');
};
