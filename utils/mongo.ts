import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { FileType, UserInfo } from "../definition/primary";

const uri =
  "mongodb+srv://score-rum:EcbNih00BmMKaJ9Z@cluster0.ufubhc9.mongodb.net/?retryWrites=true&w=majority";

export async function writeUser(userInfo: UserInfo) {
  const client = new MongoClient(uri);
  try {
    await client.connect()
    const database = client.db("score-rum");
    const users = database.collection("users");
    const result = await users.insertOne({
      id: userInfo.id,
      name: userInfo.name,
      gender: userInfo.gender,
      age: userInfo.age,
      email: userInfo.email,
      token: userInfo.token,
    });
    client.close();
    return result;
  } finally {
    client.close();
  }
}

export async function readUser(userId: string) {
  const client = new MongoClient(uri);
  try {
    await client.connect()
    const database = client.db("score-rum");
    const users = database.collection("users");
    const query = { id: userId };
    const options = {
      sort: {},
    };
    const user = await users.findOne(query, options);
    // since this method returns the matched document, not a cursor, print it directly
    client.close();
    if (user) {
      return {
        id: user.id,
        age: user.age,
        gender: user.gender,
        name: user.name,
        email: user.email,
        token: user.token,
      };
    } else {
      return undefined;
    }
  } finally {
    client.close();
  }
}

export async function getFileList(userId: string, basePath: string) {
  const client = new MongoClient(uri);
  try {
    await client.connect()
    const database = client.db("score-rum");
    const files = database.collection("files");
    const query = { userId: userId, basePath: basePath, isDeleted: false };
    const options = {
      sort: {},
    };
    const fileList = await files.find(query, options).toArray();
    client.close();
    if (fileList) {
      return fileList;
    } else {
      return [];
    }
  } finally {
    client.close();
  }
}

export async function createFile(
  userId: string,
  basePath: string,
  fileName: string,
  fileType: FileType
) {
  const client = new MongoClient(uri);
  try {
    await client.connect()
    const database = client.db("score-rum");
    let scoreId = "";
    if (fileType === FileType.file) {
      fileName = fileName + ".shot";
      const scores = database.collection("scores");
      const score_result = await scores.insertOne({
        fileName: fileName,
        content: "",
      });
      scoreId = score_result.insertedId.toString();
    }
    const files = database.collection("files");
    const result = await files.insertOne({
      userId: userId,
      basePath: basePath,
      fileName: fileName,
      fileType: fileType,
      scoreId: scoreId,
      isDeleted: false,
    });
    client.close();
    return result;
  } finally {
    client.close();
  }
}

export async function updateFile(fileId: string, content: string) {
  const client = new MongoClient(uri);
  try {
    await client.connect()
    const database = client.db("score-rum");
    const files = database.collection("files");
    // create a filter for a movie to update
    const filter = { fileId: fileId };
    // this option instructs the method to create a document if no documents match the filter
    const options = {};
    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        content: content,
      },
    };
    const result = await files.updateOne(filter, updateDoc, options);
    return result;
  } finally {
    await client.close();
  }
}

export async function deleteFile(
  userId: string,
  fileName: string,
  basePath: string
) {
  const client = new MongoClient(uri);
  try {
    await client.connect()
    const database = client.db("score-rum");
    const files = database.collection("files");
    // create a filter for a movie to update
    // this option instructs the method to create a document if no documents match the filter
    // create a document that sets the plot of the movie
    const query = { userId: userId, fileName: fileName, basePath: basePath };
    const options = {
      sort: {},
    };
    const file = await files.findOne(query, options);
    console.log(file)
   if (file) {
      await files.deleteOne({ _id: file._id });
      if (file.fileType === FileType.file) {
        const scores = database.collection("scores");
        await scores.deleteOne({ _id: new ObjectId(file.scoreId) });
      }
    }
  } finally {
    await client.close();
  }
}

export async function getFileContent(scoreId: string) {
  const client = new MongoClient(uri);
  try {
    await client.connect()
    const database = client.db("score-rum");
    const files = database.collection("scores");
    // create a filter for a movie to update
    // this option instructs the method to create a document if no documents match the filter
    // create a document that sets the plot of the movie
    const query = { _id: new ObjectId(scoreId) };
    const options = {
      sort: {},
    };
    const score = await files.findOne(query, options);
    return score;
  } finally {
    await client.close();
  }
}
