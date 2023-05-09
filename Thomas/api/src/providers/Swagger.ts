import { Application } from 'express';
import swaggerUi from "swagger-ui-express";

class Swagger {
	public mount(_express: Application): Application {
		_express.use(
            "/docs",
            swaggerUi.serve,
                swaggerUi.setup(undefined, {
                    swaggerOptions: {
                    url: "/swagger.json",
                },
            })
        );
        return _express;
	}
}

export default new Swagger;