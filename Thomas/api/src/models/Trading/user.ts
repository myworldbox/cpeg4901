
//import crypto from 'crypto';
//import bcrypt from 'bcrypt-nodejs';

import { IUser } from '../../interfaces/Trading/user';
import mongoose from 'mongoose';
import conn from '../../providers/DatabaseCAP'
import bcrypt from 'bcrypt';

// Create the model schema & register your custom methods here
export interface IUserModel extends IUser, mongoose.Document {
    matchPassword(givenPassword: string): boolean;
}

// Define the User Schema
export const UserSchema = new mongoose.Schema<IUserModel>({  
    login_name: String,
    display_name: String,
    password: String,
    email_verified: Boolean,
    dtCreated: Date,
    dtUpdated: Date,
});


UserSchema.methods.matchPassword = function (givenPassword: string): boolean {
	return bcrypt.compareSync(this.password, givenPassword)
};

UserSchema.set('collection', 'User');
const User = conn.model<IUserModel>('User', UserSchema);

export default User;
