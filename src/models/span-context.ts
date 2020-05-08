import * as ls from '../types';
export class SpanContext implements ls.SpanContext {
  readonly traceId: string;
  readonly spanId: string;

  constructor({ traceId, spanId }: { traceId: string; spanId: string }) {
    this.traceId = traceId;
    this.spanId = spanId;
  }
}
