import * as ls from '../types';

export class ReportRequest implements ls.ReportRequest {
  readonly reporter: ls.Reporter;
  readonly auth: ls.Auth;
  readonly spans: ls.Span[];
  readonly timestampOffsetMicros: string;

  constructor({
    reporter,
    auth,
    spans,
    timestampOffsetMicros,
  }: {
    reporter: ls.Reporter;
    auth: ls.Auth;
    spans: ls.Span[];
    timestampOffsetMicros: string;
  }) {
    this.reporter = reporter;
    this.auth = auth;
    this.spans = spans;
    this.timestampOffsetMicros = timestampOffsetMicros;
  }
}
