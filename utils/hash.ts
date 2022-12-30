const { createHash } = require("crypto");

const HASHING_EXPIRED_DURATION_MILLI_SECOND = 1000 * 60 * 15;

export const hashing: (content: string) => string = (content) => {
  return createHash("sha256")
    .update(content + process.env.NODE_ENV)
    .digest("hex");
};

export const generateToken: (id: string, pwd: string) => string = (id, pwd) => {
  const rotateKeyword = Math.floor(
    Date.now() / HASHING_EXPIRED_DURATION_MILLI_SECOND
  )
    .toString()
    .split("");
  const idArray = id.split("");
  const pwdArray = pwd.split("").reverse();
  const tokenContent = [];
  for (let i = 0; i < 8; i++) {
    tokenContent.push(idArray[i % idArray.length]);
    tokenContent.push(pwdArray[i % pwdArray.length]);
    tokenContent.push(rotateKeyword[i % rotateKeyword.length]);
  }
  return hashing(tokenContent.join(""));
};
