import { UserInfo } from "../definition/primary";

export const clientGetUserInfoByToken: (
  id: string,
  token: string
) => Promise<UserInfo> = (id, token) => {
  const url = new URL(window.location.origin + "/api/auth/token");
  const params = new URLSearchParams(url.search);
  params.set("id", id);
  params.set("token", token);
  url.search = params.toString();
  return fetch(url.toString(), {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response
          .json()
          .then((data) => {
            if (data.userInfo) {
              return data.userInfo;
            } else {
              throw new Error("can't signin by info");
            }
          })
          .catch(() => {
            throw new Error("can't signin by info");
          });
      }
    })
    .catch(() => {
      throw new Error("can't signin by info");
    });
};

export const clientGetIsExistId: (id: string) => Promise<boolean> = (id) => {
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

export const clientGetUserInfo: (
  loginName: string,
  password: string
) => Promise<UserInfo> = (loginName, password) => {
  const url = new URL(window.location.origin + "/api/auth/signin");
  return fetch(url.toString(), {
    method: "POST",
    body: JSON.stringify({
      loginName: loginName,
      password: password,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response
          .json()
          .then((data) => {
            if (data.userInfo) {
              return data.userInfo;
            } else {
              throw new Error("fail login");
            }
          })
          .catch((error) => {
            throw new Error("fail login");
          });
      }
    })
    .catch(() => {
      throw new Error("fail login");
    });
};

export const clientPostCreateUser: (
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

export const clientResendAuthorizationMail: (loginName: string, email: string) => Promise<boolean> = (loginName, email) => {
  const url = new URL(window.location.origin + `/api/auth/email`);
  return fetch(url.toString(), {
    method: "POST",
    body: JSON.stringify({
      loginName: loginName,
      email: email
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json().then((data) => {
        return data.success;
      });
    }
  });
};
