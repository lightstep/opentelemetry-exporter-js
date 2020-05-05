import { Relationship, SpanContext } from '../types';

export class Reference {
  readonly relationship: Relationship;
  readonly spanContext: SpanContext;

  constructor({
    relationship,
    spanContext,
  }: {
    relationship: Relationship;
    spanContext: SpanContext;
  }) {
    this.relationship = relationship;
    this.spanContext = spanContext;
  }
}
