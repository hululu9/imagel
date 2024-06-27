import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// caching
let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
  cached = (global as any).mongoos = {
    conn: null, promise: null
  }
}

// connect to database
export const connectToDatabase = async () => {
  // first to check if we have cache, if we've have the cached connection, exit out 
  if (cached.conn) return cached.conn;

  if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  // if not, to create a new cached promise (existing promise or new connection)
  cached.promise = 
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: 'imagel', bufferCommands: false
    })

  cached.conn = await cached.promise;

  return cached.conn;
}