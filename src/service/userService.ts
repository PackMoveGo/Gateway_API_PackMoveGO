import User from '../model/userModel';
import mongoose from 'mongoose';

export interface IUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const createUser = async (userData: IUserData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
  }

    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw error;
    }
    throw new Error('Error creating user');
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error('Error finding user');
  }
}; 