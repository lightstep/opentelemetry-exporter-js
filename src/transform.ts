import { hrTimeDuration, hrTimeToMicroseconds } from '@opentelemetry/core';
import { ReadableSpan } from '@opentelemetry/tracing';
import { HrTime, Link, TimedEvent } from '@opentelemetry/api';
import * as lsTypes from './types';
import { hexToDec } from './utils';
import { Attributes } from './enums';

const proto = require('./generated_proto/collector_pb.js');
const googleProtoBufTimestampPB = require('google-protobuf/google/protobuf/timestamp_pb.js');

/**
 * create new auth proto based on token
 * @param token
 */
export function createAuthProto(token: string): lsTypes.AuthProto {
  const authProto = new proto.Auth();
  authProto.setAccessToken(token);
  return authProto;
}

/**
 * convert spans to protobuf
 * @param runtimeGUID
 * @param serviceName
 * @param version
 * @param attributes
 * @param token
 * @param startTime
 * @param spans
 */
export function toBuffer(
  runtimeGUID: string,
  serviceName: string,
  version: string,
  attributes: { [key: string]: any },
  authProto: lsTypes.AuthProto,
  startTime: HrTime,
  spans: lsTypes.SpanProto[]
): Uint8Array {
  const reportProto: lsTypes.ReportRequestProto = new proto.ReportRequest();

  reportProto.setAuth(authProto);

  reportProto.setReporter(
    getRuntime(runtimeGUID, serviceName, version, attributes)
  );

  reportProto.setSpansList(spans);
  reportProto.setTimestampOffsetMicros(0);

  return reportProto.serializeBinary();
}

export function toSpan(span: ReadableSpan): lsTypes.SpanProto {
  const spanProto: lsTypes.SpanProto = new proto.Span();

  // span context
  spanProto.setSpanContext(getSpanContextProto(span));

  // operation name
  spanProto.setOperationName(span.name);

  // references
  spanProto.setReferencesList(getReferences(span));

  // start time
  spanProto.setStartTimestamp(getStartTime(span));

  // duration
  spanProto.setDurationMicros(getDuration(span).toString());

  // tags
  spanProto.setTagsList(getTags(span));

  // logs (events)
  spanProto.setLogsList(getLogs(span));

  return spanProto;
}

function getDuration(span: ReadableSpan): number {
  const duration = hrTimeDuration(span.startTime, span.endTime);
  const durationMicros = hrTimeToMicroseconds(duration);
  return durationMicros;
}

function getLogs(span: ReadableSpan) {
  const logs: lsTypes.LogProto[] = [];
  span.events.forEach((event: TimedEvent) => {
    const log: lsTypes.LogProto = new proto.Log();

    // time
    let ts = new googleProtoBufTimestampPB.Timestamp();
    ts.setSeconds(event.time[0]);
    ts.setNanos(event.time[1]);
    log.setTimestamp(ts);

    let keyValues = [];

    // main event
    keyValues.push(NewKeyValue('event', event.name));

    // event attributes
    const attributes = event.attributes || {};
    Object.keys(attributes).forEach((key: string) => {
      keyValues.push(NewKeyValue(key, attributes[key]));
    });

    log.setFieldsList(keyValues);
    logs.push(log);
  });

  return logs;
}

function getReferences(span: ReadableSpan) {
  const referenceList = [];
  const context = span.spanContext;

  // reference - parent
  if (typeof span.parentSpanId !== 'undefined') {
    const ref = new proto.Reference();
    ref.setRelationship(proto.Reference.Relationship.CHILD_OF);
    const parentSpanContext = new proto.SpanContext();
    parentSpanContext.setSpanId(hexToDec(span.parentSpanId));
    parentSpanContext.setTraceId(hexToDec(context.traceId));
    ref.setSpanContext(parentSpanContext);
    referenceList.push(ref);
  }

  // reference links
  span.links.forEach((link: Link) => {
    const ref = new proto.Reference();
    const linkContext = link.spanContext;
    if (linkContext.spanId === span.parentSpanId) {
      ref.setRelationship(proto.Reference.Relationship.CHILD_OF);
    } else {
      ref.setRelationship(proto.Reference.Relationship.FOLLOWS_FROM);
    }
    const parentSpanContext = new proto.SpanContext();
    parentSpanContext.setSpanId(hexToDec(linkContext.spanId));
    parentSpanContext.setTraceId(hexToDec(linkContext.traceId));
    ref.setSpanContext(parentSpanContext);
    referenceList.push(ref);
  });
  return referenceList;
}

function getRuntime(
  runtimeGUID: string = '',
  serviceName: string,
  version: string,
  attributes: { [key: string]: any }
) {
  const tracerVersion = NewKeyValue(Attributes.TRACER_VERSION, version);

  const tracerPlatform = NewKeyValue(
    Attributes.TRACER_PLATFORM,
    attributes[Attributes.TRACER_PLATFORM]
  );

  const componentName = NewKeyValue(Attributes.COMPONENT_NAME, serviceName);

  const commandLine = NewKeyValue(
    Attributes.COMMAND_LINE,
    attributes[Attributes.COMMAND_LINE]
  );

  const hostname = NewKeyValue(
    Attributes.HOSTNAME,
    attributes[Attributes.HOSTNAME]
  );

  const tracerPlatformVersion = NewKeyValue(
    Attributes.TRACER_PLATFORM_VERSION,
    attributes[Attributes.TRACER_PLATFORM_VERSION]
  );

  const reporterId = hexToDec(runtimeGUID);

  const tracerTags: lsTypes.KeyValueProto[] = [];
  const keys = Object.keys(attributes);

  keys.forEach(key => {
    tracerTags.push(NewKeyValue(key, attributes[key]));
  });

  const reporterTags = [
    tracerVersion,
    tracerPlatform,
    componentName,
    commandLine,
    hostname,
    tracerPlatformVersion,
  ];
  const allTags = reporterTags.concat(tracerTags);

  const reporterProto: lsTypes.ReporterProto = new proto.Reporter();
  reporterProto.setReporterId(reporterId);
  reporterProto.setTagsList(allTags);

  return reporterProto;
}

function getSpanContextProto(span: ReadableSpan) {
  const context = span.spanContext;
  let spanContextProto: lsTypes.SpanContextProto = new proto.SpanContext();
  spanContextProto.setTraceId(hexToDec(context.traceId));
  spanContextProto.setSpanId(hexToDec(context.spanId));
  return spanContextProto;
}

function getStartTime(span: ReadableSpan) {
  const startTimestamp: lsTypes.TimestampProto = new googleProtoBufTimestampPB.Timestamp();
  startTimestamp.setSeconds(span.startTime[0]);
  startTimestamp.setNanos(span.startTime[1]);
  return startTimestamp;
}

function getTags(span: ReadableSpan): lsTypes.KeyValueProto[] {
  const attributes = span.attributes;
  const attributeKeys = Object.keys(attributes);
  const tags: lsTypes.KeyValueProto[] = [];
  if (attributeKeys.length > 0) {
    attributeKeys.forEach(key => {
      tags.push(NewKeyValue(key, attributes[key]));
    });
  }
  return tags;
}

function NewKeyValue(key: string, value: any): lsTypes.KeyValueProto {
  const keyValue: lsTypes.KeyValueProto = new proto.KeyValue();
  keyValue.setKey(key);
  keyValue.setStringValue(String(value));
  return keyValue;
}
