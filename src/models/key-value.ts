export class KeyValue {
  readonly key: string;
  readonly stringValue?: string;
  readonly intValue?: string;
  readonly doubleValue?: number;
  readonly boolValue?: boolean;
  readonly jsonValue?: string;

  constructor({ key, value }: { key: string; value: any }) {
    this.key = key;
    switch (typeof value) {
      case 'string':
        this.stringValue = value;
        break;
      case 'number':
        if (Number.isInteger(value)) this.intValue = String(value);
        else this.doubleValue = value;
        break;
      case 'bigint':
        this.intValue = String(value);
        break;
      case 'object':
        this.jsonValue = JSON.stringify(value);
        break;
      default:
        this.stringValue = String(value);
    }
  }
}
