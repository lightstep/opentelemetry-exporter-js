import { Auth, Reporter, Span } from '../types2';

export class ReportRequest {
  reporter?: Reporter;
  auth?: Auth;
  spans?: Span[];
  timestampOffsetMicros?: string;
}
