export type UserInfo = {
  id: string;
  age: string;
  gender: string;
  email: string;
  name: string;
  token: string;
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
}
