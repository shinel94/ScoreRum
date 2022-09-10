import { ObjectId } from "mongodb";
import { RumFile, Score } from "../definition/derived";
import { FileType } from "../definition/primary";

export const getFileList: (
  userId: string,
  basePath: string
) => Promise<RumFile[]> = (userId, basePath) => {
  const url = new URL(window.location.origin + "/api/files");
  const params = new URLSearchParams(url.search);
  params.set("id", userId);
  params.set("base_path", basePath);
  url.search = params.toString();
  return fetch(url.toString(), {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => {
          return RumFile.fromFileListResponse(data.files);
        });
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

export const createFile: (
  userId: string,
  basePath: string,
  fileName: string,
  fileType: FileType
) => Promise<void> = (userId, basePath, fileName, fileType) => {
  const url = new URL(window.location.origin + "/api/files");
  return fetch(url.toString(), {
    method: "POST",
    body: JSON.stringify({
      id: userId,
      base_path: basePath,
      file_name: fileName,
      file_type: fileType,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => {
          return data;
        });
      } else {
        return undefined;
      }
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
};

export const updateFile: (fileId: string, content: string) => Promise<void> = (
  fileId,
  content
) => {
  const url = new URL(window.location.origin + "/api/files/update");
  return fetch(url.toString(), {
    method: "PUT",
    body: JSON.stringify({
      file_id: fileId,
      content: content,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => {
          return data;
        });
      } else {
        return undefined;
      }
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
};

export const deleteFile: (
  userId: string,
  fileName: string,
  basePath: string,
) => Promise<void> = (userId, fileName, basePath) => {
  const url = new URL(window.location.origin + "/api/files");
  const params = new URLSearchParams(url.search);
  params.set("user_id", userId);
  params.set("file_name", fileName);
  params.set("base_path", basePath);
  url.search = params.toString();
  return fetch(url.toString(), {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => {
          return data;
        });
      } else {
        return undefined;
      }
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
};

export const getScoreContent: (scoreId: string) => Promise<Score | undefined> = (
  scoreId
) => {
  const url = new URL(window.location.origin + "/api/files/content");
  const params = new URLSearchParams(url.search);
  params.set("score_id", scoreId);
  url.search = params.toString();
  return fetch(url.toString(), {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => {
          return new Score(scoreId, data.content);
        });
      } else {
        return undefined;
      }
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
};
