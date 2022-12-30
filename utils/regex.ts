export const isEmail: (email: string) => boolean = (email) => {
  return /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.exec(email)
    ? true
    : false;
};
