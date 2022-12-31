export type UserInfo = {
  dbId: number;
  loginName: string;
  nickName: string;
  email: string;
  isEmailAuth: boolean;
  token: string;
  hash?: string;
};

export enum FileType {
  file = 940,
  directory = 526,
}

export type Length = {
  value: string;
  label: string;
};

export type Sound = {
  value: string;
  label: string;
};

export type SmtpMailOption = {
  from: string;
  to: string;
  subject: string;
  html: string;
};
