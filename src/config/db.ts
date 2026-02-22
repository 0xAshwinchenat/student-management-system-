import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('✗ MONGODB_URI is not defined in the environment variables.');
    console.error('  Please add MONGODB_URI to your .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB Connected successfully');

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠ MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('✗ MongoDB connection error:', err);
    });
  } catch (err: any) {
    console.error('✗ Failed to connect to MongoDB:', err.message);
    console.error('  Make sure your MongoDB Atlas connection string is correct.');
    console.error('  Template: mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>');
    process.exit(1);
  }
};

export default connectDB;
