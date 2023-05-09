import mongoose from "mongoose";
import { IDictionary } from "../dict";

export interface IOrder{
    executionDate: Date;
    side: string;
    value: number;
    quantity: number;
}

export interface IModel {  
    name: string;
    userId: mongoose.Types.ObjectId;
    invested_amount: number;
    started: boolean;

    stocks: Array<IDictionary<number>>;
    realisedProfit: number;
    orderHistory: Array<IOrder>;

    dtUpdated: Date;
    dtCreated: Date;
}

export default IModel;
