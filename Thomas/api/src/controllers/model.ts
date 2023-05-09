import { Get, Post, Route, Body, Controller, Path, Response, SuccessResponse, Tags, Request, Header, Query, Security, Middlewares, Res, TsoaResponse, Delete } from "tsoa";
import ModelService from "../services/model";
import { ValidateErrorJSON, UnauthorizeError } from "../interfaces/error";
import { setTimeout } from "timers/promises";
import { IDictionary } from "../interfaces/dict";
import mongoose from "mongoose";

export interface modelCreationInput{
    name: string;
    userId: mongoose.Types.ObjectId;
    invested_amount: number;
    stocks: Array<IDictionary<number>>;
}
@Tags("Model")
@Route("model")
export class ModelController extends Controller {
    @Get("/all")
    public async getAllModel(
        @Header() csrfToken: string,
        @Res() unauthorizedResponse: TsoaResponse<401, { reason: string, details: string }>, 
        @Res() internalErrorResponse: TsoaResponse<500, { reason: string, details: string }>
    ): Promise<any> {
        return ModelService.getAllModel(unauthorizedResponse, internalErrorResponse);
    }

    @Get("{modelId}")
    public async getModelById(
        @Path() modelId: string,
        @Header() csrfToken: string,
        @Res() unauthorizedResponse: TsoaResponse<401, { reason: string, details: string }>, 
        @Res() internalErrorResponse: TsoaResponse<500, { reason: string, details: string }>
    ): Promise<any> {
        return ModelService.getModelById(modelId, unauthorizedResponse, internalErrorResponse);
    }

    @Post()
    public async AddModel(
        @Header() csrfToken: string,
        @Res() unauthorizedResponse: TsoaResponse<401, { reason: string, details: string }>, 
        @Res() internalErrorResponse: TsoaResponse<500, { reason: string, details: string }>,
        @Body() body: modelCreationInput
    ): Promise<any> {
        return ModelService.addModel(body, unauthorizedResponse, internalErrorResponse);
    }

    @Post('/start')
    public async StartModel(
        @Header() csrfToken: string,
        @Res() unauthorizedResponse: TsoaResponse<401, { reason: string, details: string }>, 
        @Res() internalErrorResponse: TsoaResponse<500, { reason: string, details: string }>,
        @Body() body: modelCreationInput
    ): Promise<any> {
        return null;
    }

    @Post('/terminate')
    public async TerminateModel(
        @Header() csrfToken: string,
        @Res() unauthorizedResponse: TsoaResponse<401, { reason: string, details: string }>, 
        @Res() internalErrorResponse: TsoaResponse<500, { reason: string, details: string }>,
        @Body() body: modelCreationInput
    ): Promise<any> {
        return null;
    }

    @Delete()
    public async DeleteModel(
        @Header() csrfToken: string,
        @Res() unauthorizedResponse: TsoaResponse<401, { reason: string, details: string }>, 
        @Res() internalErrorResponse: TsoaResponse<500, { reason: string, details: string }>,
        @Body() body: modelCreationInput
    ): Promise<any> {
        return null;
    }
}