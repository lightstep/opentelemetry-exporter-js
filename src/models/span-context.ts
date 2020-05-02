export class SpanContext {
  readonly traceId: string;
  readonly spanId: string;

  constructor({ traceId, spanId }: { traceId: string; spanId: string }) {
    this.traceId = traceId;
    this.spanId = spanId;
  }
}
