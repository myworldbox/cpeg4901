import { Get, Route, Tags, Request, Security, Header, Middlewares, Controller } from "tsoa";
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNext } from 'express';
import { setTimeout } from "timers/promises";
interface PingResponse {
  message: string;
}

@Tags("Development Endpoints")
@Route("/")
export class PingController extends Controller {
  @Get("/ping")
  public async ping(): Promise<PingResponse> {
    return {
      message: "pong",
    };
  }
  
}
