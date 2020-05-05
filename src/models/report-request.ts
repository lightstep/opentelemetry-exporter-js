import { Auth, Reporter, Span } from '../types';

export class ReportRequest {
  readonly reporter: Reporter;
  readonly auth: Auth;
  readonly spans: Span[];
  readonly timestampOffsetMicros: string;

  constructor({
    reporter,
    auth,
    spans,
    timestampOffsetMicros,
  }: {
    reporter: Reporter;
    auth: Auth;
    spans: Span[];
    timestampOffsetMicros: string;
  }) {
    this.reporter = reporter;
    this.auth = auth;
    this.spans = spans;
    this.timestampOffsetMicros = timestampOffsetMicros;
  }
}
