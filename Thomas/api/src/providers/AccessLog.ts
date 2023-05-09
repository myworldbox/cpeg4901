
import { Application } from 'express'
import { createStream } from 'rotating-file-stream'
import { createWriteStream } from 'fs'
import Locals from './Locals'
import path from 'path'
import morgan from "morgan"

class AccessLog {
    public static init(_express: Application): Application {
        var errorLogStream =  createWriteStream(path.join(__dirname, '../../.log/error.log'), { flags: 'a' })

        var accessLogStream =  createStream('access.log', {
            interval: '1d', 
            path: path.join(__dirname, '../../.log'),
            maxFiles: Number(Locals.config().logDays),
        })

        _express.use(morgan('common', {
            stream: errorLogStream,
            skip: function (req, res) { return res.statusCode < 400 }
        }));
        
        _express.use(morgan("tiny", { stream: accessLogStream }));

        return _express;
    }
}

export default AccessLog;