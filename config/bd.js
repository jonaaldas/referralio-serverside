import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const mongodb = async () => {
  try {
    return mongoose.connect(process.env.DATABASE_URL);
  } catch (error) {
    return error;
  }
};

export default mongodb;
