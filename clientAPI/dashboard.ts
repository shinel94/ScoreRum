import { FileType } from "../definition/primary"

export const getFileList: (userId: string, basePath: string) => Promise<void> = (userId, basePath) => {
    const url = new URL(window.location.origin + '/api/files')
    const params = new URLSearchParams(url.search)
    params.set('id', userId)
    params.set('base_path', basePath)
    url.search = params.toString()
    return fetch(url.toString(), {
        method: 'GET'
    }).then((response)=> {
        if (response.ok) {
            return response.json().then((data) => {
                return data
            })
        }
        else {
            return undefined
        }
    }).catch(error => {
        console.log(error)
        return undefined
    })
}

export const createFile: (userId: string, basePath: string, fileName: string, fileType: FileType) => Promise<void> = (userId, basePath, fileName, fileType) => {
    const url = new URL(window.location.origin + '/api/files')
    return fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({
            id: userId,
            base_path: basePath,
            file_name: fileName,
            file_type: fileType
        })
    }).then((response)=> {
        if (response.ok) {
            return response.json().then((data) => {
                return data
            })
        }
        else {
            return undefined
        }
    }).catch(error => {
        console.log(error)
        return undefined
    })
}

export const updateFile: (fileId: string, content: string) => Promise<void> = (fileId, content) => {
    const url = new URL(window.location.origin + '/api/files/update')
    return fetch(url.toString(), {
        method: 'PUT',
        body: JSON.stringify({
            file_id: fileId,
            content: content,
        })
    }).then((response)=> {
        if (response.ok) {
            return response.json().then((data) => {
                return data
            })
        }
        else {
            return undefined
        }
    }).catch(error => {
        console.log(error)
        return undefined
    })
}
