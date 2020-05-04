import { KeyValue } from '../types2';

export class Log {
  readonly timestamp: Date;
  readonly fields: KeyValue[];

  constructor({
    timestamp,
    fields = [],
  }: {
    timestamp: Date;
    fields?: KeyValue[];
  }) {
    this.timestamp = timestamp;
    this.fields = fields;
  }
}