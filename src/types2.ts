/**
 * An interface representing Auth.
 */
export interface Auth {
  accessToken: string;
}

/**
 * Represent both tags and log fields.
 */
export interface KeyValue {
  key: string;
  /**
   * Holds arbitrary string data; well-formed JSON strings should go in
   * json_value.
   */
  stringValue?: string;
  // intValue?: string;
  // doubleValue?: number;
  // boolValue?: boolean;
  /**
   * Must be a well-formed JSON value. Truncated JSON should go in
   * string_value. Should not be used for tags.
   */
  // jsonValue?: string;
}

/**
 * An interface representing Log.
 */
export interface Log {
  timestamp?: Date;
  //timestamp?: number;
  fields: KeyValue[];
}

/**
 * An interface representing Reference.
 */
export interface Reference {
  /**
   * Possible values include: 'CHILD_OF', 'FOLLOWS_FROM'. Default value: 'CHILD_OF'.
   */
  relationship?: Relationship;
  spanContext?: SpanContext;
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
  reporterId?: string;
  tags?: KeyValue[];
}

/**
 * An interface representing ReportRequest.
 */
export interface ReportRequest {
  reporter?: Reporter;
  auth?: Auth;
  spans?: Span[];
  timestampOffsetMicros?: string;
}

/**
 * An interface representing Span.
 */
export interface Span {
  spanContext?: SpanContext;
  operationName?: string;
  references?: Reference[];
  startTimestamp?: Date;
  durationMicros?: string;
  tags?: KeyValue[];
  logs?: Log[];
}

/**
 * An interface representing SpanContext.
 */
export interface SpanContext {
  traceId: string;
  spanId: string;
}

// export interface Auth {}

// /**
//  * Represent both tags and log fields.
//  */
// export interface KeyValue {
//   // setKey: Function;
//   // setStringValue: Function;
//   key: string;
//   stringValue: string;
// }

// export interface Log {
//   setTimestamp: Function;
//   setFieldsList: Function;
// }

// export interface Reporter {
//   // setReporterId: Function;
//   // setTagsList: Function;
//   reporterId: string;
//   tags: KeyValue[];
// }

// export interface ReportRequest {
//   setAuth: Function;
//   setReporter: Function;
//   setSpansList: Function;
//   setTimestampOffsetMicros: Function;
//   serializeBinary: Function;
//   toObject: Function;
// }

// export interface SpanContext {
//   setTraceId: Function;
//   setSpanId: Function;
// }

// export interface Span {
//   setSpanContext: Function;
//   setOperationName: Function;
//   setReferencesList: Function;
//   setStartTimestamp: Function;
//   setDurationMicros: Function;
//   setTagsList: Function;
//   setLogsList: Function;
//   serializeBinary: Function;
// }

// export interface Timestamp {
//   setSeconds: Function;
//   setNanos: Function;
// }
