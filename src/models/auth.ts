export class Auth {
  readonly accessToken: string;

  constructor({ accessToken }: { accessToken: string }) {
    this.accessToken = accessToken;
  }
}
