import { KeyValue, Log, Reference, SpanContext } from '../types2';

export class Span {
  readonly spanContext: SpanContext;
  readonly operationName: string;
  readonly references: Reference[];
  readonly startTimestamp: Date;
  readonly durationMicros: string;
  readonly tags: KeyValue[];
  readonly logs: Log[];

  constructor({
    spanContext,
    operationName,
    references,
    startTimestamp,
    durationMicros,
    tags,
    logs,
  }: {
    spanContext: SpanContext;
    operationName: string;
    references: Reference[];
    startTimestamp: Date;
    durationMicros: string;
    tags: KeyValue[];
    logs: Log[];
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
