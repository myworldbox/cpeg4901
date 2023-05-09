import Log from '../logger';
import express, {
	Response as ExResponse,
	Request as ExRequest,
	NextFunction,
  } from "express";
import Locals from './Locals';

import { ValidateError } from "tsoa";
class Handler {
	// Handles all the not found routes
	public static notFoundHandler(_express: any): any {

		_express.use('*', (req: any, res: any) => {
			const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

			Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);
			res.status(404);
			return res.json({reason:'API not found!'});
		});

		return _express;
	}

	// Handles your api/web routes errors/exception
	public static clientErrorHandler(err: any, req: any, res: any, next: any): any {
		Log.error(err.stack);

		if (req.xhr) {
			return res.status(500).send({ reason: 'Something went wrong!' });
		} else {
			return next(err);
		}
	}

	// Show error incase any other error
	public static errorHandler(err: any, req: any, res: any, next: any): any {
		if (err instanceof ValidateError) {
			console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
			return res.status(422).json({
				reason: "Validation Failed",
				details: err?.fields,
			});
		}
		if (err instanceof SyntaxError && 'body' in err) {
			console.error(`Caught Json Format Error for ${req.path}:`, err.message);
			return res.status(400).json({
				reason: "Bad Request",
				details: "Json Format Error ",
			});
		}
		
		if (err.message === "Unauthorized"){
			return res.status(401).json({
				reason: "Authorization Failed",
				details: "Invalid Session or CSRF Token",
			});
		}


		return res.status(400).json({
			reason: "Bad Request",
			details: "Unknown Error",
		});
	}

	// Register error monitoring tools, other tools can also be added before "next(err)"
	public static logErrors(err: any, req: any, res: any, next: any): any {
		Log.error(err.stack);

		return next(err);
	}
}

export default Handler;
