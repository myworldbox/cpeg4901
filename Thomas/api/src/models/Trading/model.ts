
//import crypto from 'crypto';
//import bcrypt from 'bcrypt-nodejs';

import { IModel, IOrder } from '../../interfaces/Trading/model';
import mongoose from 'mongoose';
import conn from '../../providers/DatabaseCAP'
import bcrypt from 'bcrypt';
import { IDictionary } from '../../interfaces/dict';

// Create the model schema & register your custom methods here
export interface IModelModel extends IModel, mongoose.Document {
}

// Define the User Schema
export const ModelSchema = new mongoose.Schema<IModelModel>({  
    name: String,
    userId: mongoose.Types.ObjectId,
    invested_amount: Number,
    started: Boolean,

    stocks: Array<IDictionary<number>>,
    realisedProfit: Number,
    orderHistory: Array<IOrder>,

    dtUpdated: Date,
    dtCreated: Date,
});


ModelSchema.set('collection', 'Model');
const Model = conn.model<IModelModel>('Model', ModelSchema);

export default Model;
