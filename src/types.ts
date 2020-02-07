export interface KeyValueProto {
  setKey: Function;
  setStringValue: Function;
}

export interface LogProto {
  setTimestamp: Function;
  setFieldsList: Function;
}

export interface ReporterProto {
  setReporterId: Function;
  setTagsList: Function;
}

export interface ReportRequestProto {
  setAuth: Function;
  setReporter: Function;
  setSpansList: Function;
  setTimestampOffsetMicros: Function;
  serializeBinary: Function;
}

export interface SpanContextProto {
  setTraceId: Function;
  setSpanId: Function;
}

export interface SpanProto {
  setSpanContext: Function;
  setOperationName: Function;
  setReferencesList: Function;
  setStartTimestamp: Function;
  setDurationMicros: Function;
  setTagsList: Function;
  setLogsList: Function;
  serializeBinary: Function;
}

export interface TimestampProto {
  setSeconds: Function;
  setNanos: Function;
}
