export class KeyValue {
  readonly key: string;
  readonly stringValue?: string;

  constructor({ key, value }: { key: string; value: string }) {
    this.key = key;
    this.stringValue = value;
  }
}
