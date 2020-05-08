import * as ls from '../types';
export class Log implements ls.Log {
  readonly timestamp: Date;
  readonly fields: ls.KeyValue[];

  constructor({
    timestamp,
    fields = [],
  }: {
    timestamp: Date;
    fields?: ls.KeyValue[];
  }) {
    this.timestamp = timestamp;
    this.fields = fields;
  }
}
