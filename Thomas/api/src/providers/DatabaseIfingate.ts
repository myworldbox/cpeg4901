import mongoose from 'mongoose';
import bluebird from 'bluebird';
import Locals from './Locals';


const dsn = Locals.config().ifingateUrl;
const options = {   
                    autoIndex:false,                // Don't build indexes
                    maxPoolSize: 10,                // Maintain up to 10 socket connections
                    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
                    socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
                    family: 4                       // Use IPv4, skip trying IPv6
                };

(<any>mongoose).Promise = bluebird;

mongoose.set("strictQuery", true);
const conn = mongoose.createConnection(dsn, options);


export default conn;