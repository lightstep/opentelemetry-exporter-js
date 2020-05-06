import * as ls from '../types';

export class Span implements ls.Span {
  readonly spanContext: ls.SpanContext;
  readonly operationName: string;
  readonly references: ls.Reference[];
  readonly startTimestamp: Date;
  readonly durationMicros: string;
  readonly tags: ls.KeyValue[];
  readonly logs: ls.Log[];

  constructor({
    spanContext,
    operationName,
    references,
    startTimestamp,
    durationMicros,
    tags,
    logs,
  }: {
    spanContext: ls.SpanContext;
    operationName: string;
    references: ls.Reference[];
    startTimestamp: Date;
    durationMicros: string;
    tags: ls.KeyValue[];
    logs: ls.Log[];
  }) {
    this.spanContext = spanContext;
    this.operationName = operationName;
    this.references = references;
    this.startTimestamp = startTimestamp;
    this.durationMicros = durationMicros;
    this.tags = tags;
    this.logs = logs;
  }
}
