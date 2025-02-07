// lib/mongodb.js
import { MongoClient } from "mongodb";

 // Add your connection string in .env.local
const options = {};

let client;
let clientPromise;

if (!process.env.MONGO_DB_URI) {
    throw new Error("Please add your Mongo URI to .env");
}

// if (process.env.NODE_ENV === "development") {
//     if (!global._mongoClientPromise) {
//         client = new MongoClient(uri, options);
//         global._mongoClientPromise = client.connect();
//     }
//     clientPromise = global._mongoClientPromise;
// } else {
    const uri = process.env.MONGO_DB_URI;
    console.log('uri: ', uri);

    client = new MongoClient(uri, options);
    clientPromise = client.connect();
// }

export default clientPromise;
