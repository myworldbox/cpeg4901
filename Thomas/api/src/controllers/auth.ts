import { Post, Route, Body, Controller, Response, SuccessResponse, Tags, Request, Header, Query, Security, Middlewares, Res, TsoaResponse, Delete } from "tsoa";
import AuthService from "../services/auth";
import { ValidateErrorJSON, UnauthorizeError } from "../interfaces/error";
import { setTimeout } from "timers/promises";
export interface loginInput {
    username: string;
    password: string;
}

@Tags("Authentication")
@Route("auth")
export class AuthController extends Controller {
    @Post("/session/login")
    public async login(
        @Request() req: Request, 
        @Res() unauthorizedResponse: TsoaResponse<401, { reason: string, details: string }>, 
        @Res() internalErrorResponse: TsoaResponse<500, { reason: string, details: string }>,
        @Body() body: loginInput
    ): Promise<any> {
        return AuthService.login(req, body.username, body.password, unauthorizedResponse, internalErrorResponse);
    }

    @Post("/session/register")
    public async register(
        @Request() req: Request, 
        @Res() unauthorizedResponse: TsoaResponse<401, { reason: string, details: string }>, 
        @Res() internalErrorResponse: TsoaResponse<500, { reason: string, details: string }>,
        @Body() body: loginInput
    ): Promise<any> {
        return AuthService.register(req, body.username, body.password, unauthorizedResponse, internalErrorResponse);
    }

    @Security('isuser')
    @Post("/session/verification")
    public async verify_session(
        @Request() req: Request, 
        @Header() csrfToken: string,
        @Res() unauthorizedResponse: TsoaResponse<401, { reason: string, details: string }>, 
        @Res() internalErrorResponse: TsoaResponse<500, { reason: string, details: string }>
    ): Promise<any> {
        return AuthService.verify_login(req, unauthorizedResponse, internalErrorResponse);
    }

    @Delete("/session/logout")
    public async logout(
        @Request() req: Request,
        @Res() notFoundResponse: TsoaResponse<404, { reason: string, details: string }>, 
        @Res() internalErrorResponse: TsoaResponse<500, { reason: string, details: string }>,
        @Request() request: any
    ): Promise<any> {
        return AuthService.logout(req, 'test', notFoundResponse, internalErrorResponse);
    }
}