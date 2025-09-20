export class AccessTokenDto {
  access_token: string;
  type: string;
  expires_in: string;
  refresh_token?: string;

  constructor(partial: Partial<AccessTokenDto>) {
    Object.assign(this, partial);
  }
}
