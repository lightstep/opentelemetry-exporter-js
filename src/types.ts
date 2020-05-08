/**
 * An interface representing Auth.
 */
export interface Auth {
  readonly accessToken: string;
}

/**
 * Represent both tags and log fields.
 */
export interface KeyValue {
  readonly key: string;
  /**
   * Holds arbitrary string data; well-formed JSON strings should go in
   * json_value.
   */
  readonly stringValue?: string;
  readonly intValue?: string;
  readonly doubleValue?: number;
  readonly boolValue?: boolean;
  /**
   * Must be a well-formed JSON value. Truncated JSON should go in
   * string_value. Should not be used for tags.
   */
  readonly jsonValue?: string;
}

/**
 * An interface representing Log.
 */
export interface Log {
  readonly timestamp: Date;
  readonly fields: KeyValue[];
}

/**
 * An interface representing Reference.
 */
export interface Reference {
  /**
   * Possible values include: 'CHILD_OF', 'FOLLOWS_FROM'. Default value: 'CHILD_OF'.
   */
  readonly relationship: Relationship;
  readonly spanContext: SpanContext;
}

/**
 * Defines values for Relationship.
 * Possible values include: 'CHILD_OF', 'FOLLOWS_FROM'
 * @readonly
 * @enum {string}
 */
export type Relationship = 'CHILD_OF' | 'FOLLOWS_FROM';

/**
 * An interface representing Reporter.
 */
export interface Reporter {
  readonly reporterId: string;
  readonly tags: KeyValue[];
}

/**
 * An interface representing ReportRequest.
 */
export interface ReportRequest {
  readonly reporter: Reporter;
  readonly auth: Auth;
  readonly spans: Span[];
  readonly timestampOffsetMicros: string;
}

/**
 * An interface representing Span.
 */
export interface Span {
  readonly spanContext: SpanContext;
  readonly operationName: string;
  readonly references: Reference[];
  readonly startTimestamp: Date;
  readonly durationMicros: string;
  readonly tags: KeyValue[];
  readonly logs: Log[];
}

/**
 * An interface representing SpanContext.
 */
export interface SpanContext {
  readonly traceId: string;
  readonly spanId: string;
}
