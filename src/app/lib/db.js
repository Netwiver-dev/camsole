import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {}; // Remove deprecated options

let client;
let clientPromise;
let db;

if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export async function getDb() {
    if (db) return db;

    const connectedClient = await clientPromise;
    db = connectedClient.db(process.env.MONGODB_DB || "camsole");
    return db;
}

export { clientPromise };