import cors from 'cors';
import { Application } from 'express';
import Locals from './Locals';

class CORS {
	public mount(_express: Application): Application {

		const options = {
			origin: 'http://localhost:3000',	// Some legacy browsers choke on 204
			credentials: true
		};
		_express.use(cors(options));
		return _express;
	}
}

export default new CORS;