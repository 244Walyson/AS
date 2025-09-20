export enum AuthProviderEnum {
  'LOCAL' = 'LOCAL',
  'OAUTH' = 'OAUTH',
  'REFRESH' = 'REFRESH',
}
export class CredentialsDto {
  username: string;
  password?: string;
  provider?: AuthProviderEnum;
}
