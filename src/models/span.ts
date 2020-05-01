import { KeyValue, Log, Reference, SpanContext } from '../types2';

export class Span {
  spanContext?: SpanContext;
  operationName?: string;
  references?: Reference[];
  startTimestamp?: Date;
  durationMicros?: string;
  tags?: KeyValue[];
  logs?: Log[];
}
