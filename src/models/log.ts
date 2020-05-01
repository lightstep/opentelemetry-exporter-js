import { KeyValue } from '../types2';

export class Log {
  timestamp?: Date;
  fields: KeyValue[] = [];
}
