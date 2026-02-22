import mongoose from 'mongoose';
import Admin from './src/models/admin.model';
import dotenv from 'dotenv';

dotenv.config();

const clearAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MONGODB_URI not found in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Delete all admins
    const result = await Admin.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} admin(s)`);

    // Close connection
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    console.log('\nNow restart your server with: npm run dev');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

clearAdmin();
