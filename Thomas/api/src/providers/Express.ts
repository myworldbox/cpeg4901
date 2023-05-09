import express from "express";

import Log from '../logger';
import CORS from "./CORS";
import Locals from './Locals';
// import Routes from './Routes';
import { RegisterRoutes } from "../../build/routes";
import Swagger from "./Swagger";
import ExceptionHandler from './Handler';
import AccessLog from './AccessLog';

import session from 'express-session';
import MongoStore from "connect-mongo";
import ExpressMongoSanitize from "express-mongo-sanitize";

class Express {
	// Create the express object
	public express: express.Application;

	// Initializes the express server
	constructor () {
		this.express = express();
		this.express.use(express.json());
		this.express.use(express.static("public"));
		
		// Important: Order Matters. Please add mounts ONLY IFF you know what you're doing.
		this.loadDotEnv();
		this.loadAccessLog();
		this.mountCORS();
		this.express.use(
			ExpressMongoSanitize({
				allowDots: true,
				replaceWith: '_',
			}),
		);
		this.express.use(session({
			secret: 'fundingreach',
			resave: false,
			saveUninitialized: false,
			rolling: true,
			cookie: { 
				sameSite: 'strict',
				httpOnly: false, //test
				maxAge: 1 * 3600 * 1000, // in milliseconds
				secure: false,
				domain: 'localhost',
			},  // cookie expire in an hour from last activity
			store: new MongoStore({ 
				mongoUrl: 'mongodb://127.0.0.1:27017/sessions',
				autoRemove: 'interval',
				autoRemoveInterval: 30 // in minutes
			})
		}));
		this.mountRoutes();
		this.mountSwagger();
	}

	private loadDotEnv (): void {
		Log.info('Dotenv :: Loadinging in Environment...');
		this.express = Locals.init(this.express);
	}
	private loadAccessLog (): void {
		Log.info('Logging :: Loading Access Logger...');
		this.express = AccessLog.init(this.express);
	}
	private mountCORS (): void{
		Log.info('CORS :: Mounting CORS Settings...');
		this.express = CORS.mount(this.express);
	}
	private mountRoutes (): void {
		Log.info('Routes :: Mounting Web Routes...');
		RegisterRoutes(this.express);
	}
	private mountSwagger (): void {
		Log.info('Routes :: Mounting Swagger Routes...');
		this.express = Swagger.mount(this.express);
	}
	
	// Starts the express server
	public init (): any {
		const port: number = Locals.config().port;

		// Registering Exception / Error Handlers
		this.express.use(ExceptionHandler.logErrors);
		this.express.use(ExceptionHandler.clientErrorHandler);
		this.express.use(ExceptionHandler.errorHandler);
		this.express = ExceptionHandler.notFoundHandler(this.express);

		// Start the server on the specified port
		this.express.listen(port, () => {
			return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
		}).on('error', (_error) => {
			return console.log('Error: ', _error.message);
		 });;
	}
}

// Export the express module
export default new Express();
