import { UserInfo } from "../definition/primary";

export const getUserInfo: (id: string) => Promise<UserInfo | undefined> = (id) => {
    
    let url = new URL(window.location.origin + "/api/auth/naver")
    let params = new URLSearchParams(url.search);
    params.set('id', id)
    url.search = params.toString();
    return fetch(url.toString(), {
        method: "GET",
    }).then((response: any) => {
        if (response.ok) {
            return response.json().then((data: any) => {
                return data.user
            }).catch(() => {
                return undefined
            })
        }
    }).catch(error => {
        return undefined
    })
}

export const postUser: (userInfo: UserInfo) => Promise<boolean> = (userInfo) => {
    
    let url = new URL(window.location.origin + "/api/auth/naver")
    return fetch(url.toString(), {
        method: "POST",
        body: JSON.stringify({
            ...userInfo
        })
    }).then((response: any) => {
        return response.data
    }).catch(error => {
        return undefined
    })
}