import { KeyValue } from '../types2';

export class Reporter {
  readonly reporterId: string;
  readonly tags: KeyValue[];

  constructor({ reporterId, tags }: { reporterId: string; tags: KeyValue[] }) {
    this.reporterId = reporterId;
    this.tags = tags;
  }
}
