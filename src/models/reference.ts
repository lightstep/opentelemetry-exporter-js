import * as ls from '../types';
export class Reference implements ls.Reference {
  readonly relationship: ls.Relationship;
  readonly spanContext: ls.SpanContext;

  constructor({
    relationship,
    spanContext,
  }: {
    relationship: ls.Relationship;
    spanContext: ls.SpanContext;
  }) {
    this.relationship = relationship;
    this.spanContext = spanContext;
  }
}
