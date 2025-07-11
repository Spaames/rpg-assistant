import { MongoClient } from 'mongodb';

/**
 * Setting up mongoDB connection
 *
 * change dbName for dev, prod...
 * MongoURI must be in .env file
 */

export const dbName = "rpgdb";
const uriDb = process.env.MONGODB_URI as string;
const options = {}

if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB URI must be provided');
}

const mongoClient = new MongoClient(uriDb, options);
const mongoClientPromise = mongoClient.connect();

export default mongoClientPromise;