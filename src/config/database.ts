import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from config directory
dotenv.config({ path: path.join(__dirname, '../../config/.env') });

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  // Skip MongoDB connection entirely to prevent crashes
  console.log('⚠️ MongoDB connection disabled - API will work without database');
  isConnected = false;
  return;
};

export const getConnectionStatus = (): boolean => {
  return false; // Always return false since we're not using MongoDB
};

export default connectDB; 