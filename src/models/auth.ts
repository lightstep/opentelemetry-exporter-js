import * as ls from '../types';
export class Auth implements ls.Auth {
  readonly accessToken?: string;

  constructor({ accessToken }: { accessToken?: string }) {
    this.accessToken = accessToken;
  }
}
