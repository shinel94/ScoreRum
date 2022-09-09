import { MongoClient, ServerApiVersion } from "mongodb";
import { UserInfo } from "../definition/primary";

const uri =
  "mongodb+srv://score-rum:EcbNih00BmMKaJ9Z@cluster0.ufubhc9.mongodb.net/?retryWrites=true&w=majority";

export async function writeUser(userInfo: UserInfo) {
  const client = new MongoClient(uri);
  try {
    const database = client.db("score-rum");
    const users = database.collection("users");
    const result = await users.insertOne({
        id: userInfo.id,
        name: userInfo.name,
        gender: userInfo.gender,
        age: userInfo.age,
        token: userInfo.token});
    client.close();
    return result;
  } finally {
    client.close();
  }
}

export async function readUser(userId: string) {
    const client = new MongoClient(uri);
    try {
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
            token: user.token
          };
      } else {
        return undefined
      }
      
    } finally {
      client.close();
    }
  }