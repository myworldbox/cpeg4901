import Model from '../models/Trading/model';
import bcrypt from 'bcrypt';
import { TsoaResponse } from 'tsoa';
import Tokens from 'csrf';
import {modelCreationInput} from '../controllers/model'
import { model } from 'mongoose';

export class ModelService {
    
    public async addModel(
        body: modelCreationInput, 
        response: TsoaResponse<401, { reason: string, details: string }>, 
        error: TsoaResponse<500, { reason: string, details: string }>
    ) : Promise<any> {
        try {
            const model = new Model();
            model.name = body.name;
            model.userId = body.userId;
            model.invested_amount = body.invested_amount;
            model.started = false;
        
            model.stocks = body.stocks;
            model.realisedProfit = 0;
            model.orderHistory = [];
        
            model.dtUpdated = new Date();
            model.dtCreated = new Date();
            model.save();
            return {message: 'Success'}
        } catch (err: any) {
            console.log(err.message);
            return error(500, {reason: "Internal Error", details: "Encountered Unexpected Error"});
        }
    }

    
    public async getAllModel(
        response: TsoaResponse<401, { reason: string, details: string }>, 
        error: TsoaResponse<500, { reason: string, details: string }>
    ) : Promise<any> {
        try {
            const allModels = Model.find({}, {name: 1, userId: 1, invested_amount: 1, started: 1, realisedProfit: 1}).lean()
            return allModels
        } catch (err: any) {
            console.log(err.message);
            return error(500, {reason: "Internal Error", details: "Encountered Unexpected Error"});
        }
    }


    public async getModelById(
        id: string,
        response: TsoaResponse<401, { reason: string, details: string }>, 
        error: TsoaResponse<500, { reason: string, details: string }>
    ) : Promise<any> {
        try {

            const model = Model.findById(id).lean()
            return model
        } catch (err: any) {
            console.log(err.message);
            return error(500, {reason: "Internal Error", details: "Encountered Unexpected Error"});
        }
    }

}

export default new ModelService();