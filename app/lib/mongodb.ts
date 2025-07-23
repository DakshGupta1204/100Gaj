import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// In development, we want to maintain a cached connection across hot reloads
const globalWithMongo = global as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

// Initialize or use existing cached connection
if (!globalWithMongo.mongoose) {
  globalWithMongo.mongoose = { conn: null, promise: null };
}

const cached = globalWithMongo.mongoose;

async function connectDB() {
  if (cached.conn) {
    // If connection already exists, return it
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Add other options as needed for production:
      // useNewUrlParser: true, // Deprecated in Mongoose 6+
      // useUnifiedTopology: true, // Deprecated in Mongoose 6+
      // serverSelectionTimeoutMS: 5000,
      // socketTimeoutMS: 45000,
    };

    // Store the promise of the Mongoose connection itself
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => { // 'mongooseInstance' is the actual Mongoose object
        // No need to return mongooseInstance here immediately,
        // it's the resolved value of the promise itself.
        return mongooseInstance;
      });
  }

  // Await the promise. Once it resolves, set cached.conn to the resolved Mongoose instance.
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;