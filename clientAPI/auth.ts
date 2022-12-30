import { UserInfo } from "../definition/primary";

export const getIsExistId: (id: string) => Promise<boolean> = (id) => {
  const url = new URL(window.location.origin + "/api/auth/exist");
  const params = new URLSearchParams(url.search);
  params.set("id", id);
  url.search = params.toString();
  return fetch(url.toString(), {
    method: "GET",
  }).then((response) => {
    if (response.ok) {
      return response.json().then((data) => {
        return data.exist;
      });
    }
  });
};

export const postCreateUser: (
  loginName: string,
  pwd: string,
  nickName: string,
  email: string
) => Promise<UserInfo> = (loginName, pwd, nickName, email) => {
  const url = new URL(window.location.origin + "/api/auth/signup");
  return fetch(url.toString(), {
    method: "POST",
    body: JSON.stringify({
      loginName: loginName,
      password: pwd,
      nickName: nickName,
      email: email,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json().then((data) => {
        return data.userInfo;
      });
    }
  });
};
