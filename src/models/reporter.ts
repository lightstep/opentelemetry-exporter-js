import * as ls from '../types';

export class Reporter implements ls.Reporter {
  readonly reporterId: string;
  readonly tags: ls.KeyValue[];

  constructor({
    reporterId,
    tags,
  }: {
    reporterId: string;
    tags: ls.KeyValue[];
  }) {
    this.reporterId = reporterId;
    this.tags = tags;
  }
}
