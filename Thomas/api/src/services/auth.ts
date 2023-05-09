import User from '../models/Trading/user';
import bcrypt from 'bcrypt';
import { TsoaResponse } from 'tsoa';
import Tokens from 'csrf';


export class AuthService {
    public async register(
        req: any,
        username: string, 
        password: string, 
        response: TsoaResponse<401, { reason: string, details: string }>, 
        error: TsoaResponse<500, { reason: string, details: string }>
    ) : Promise<any> {
        try {
            const user = new User();
            const hash = bcrypt.hashSync(password, 10);
            user.login_name = username
            user.display_name = 'Testing Account'
            user.password = hash
            user.email_verified = false
            user.dtCreated = new Date()
            user.dtUpdated = new Date()
            user.save()

            return {message: 'Success'}
        } catch (err: any) {
            console.log(err.message);
            return error(500, {reason: "Internal Error", details: "Encountered Unexpected Error"});
        }
    }

    public async login(
        req: any,
        username: string, 
        password: string, 
        response: TsoaResponse<401, { reason: string, details: string }>, 
        error: TsoaResponse<500, { reason: string, details: string }>
    ) : Promise<any> {
        try {
            const user = await User.findOne({login_name: username});
            if (user) {
                if (bcrypt.compareSync(password, user.password)){
                    const tokens = new Tokens();
                    var secret = tokens.secretSync();
                    req.session.csrfToken = tokens.create(secret);

                    req.session.test = (req.session.test) ? req.session.test + 1 : 1;
                    req.session.isLogin = true;

                    return {csrfToken: req.session.csrfToken};
                } else {
                    return response(401, { reason: "Authorization Failed", details: "Invalid password. Please try again." });
                }
            } else {
                return response(401, { reason: "Authorization Failed",details: "Invalid username. Please try again." });
            }
        } catch (err: any) {
            console.log(err.message);
            return error(500, {reason: "Internal Error", details: "Encountered Unexpected Error"});
        }
    }

    public async verify_login(
        req: any,
        response: TsoaResponse<401, { reason: string, details: string }>, 
        error: TsoaResponse<500, { reason: string, details: string }>
    ) : Promise<any> {
        try {
            console.log(req.sessionID);
            if (req.session.isLogin) {
                const tokens = new Tokens();
                var secret = tokens.secretSync();
                req.session.csrfToken = tokens.create(secret);
                return {csrfToken: req.session.csrfToken};
            } else {
                return response(401, { reason: "Authorization Failed",details: "Invalid session. Please try again." });
            }
        } catch (err: any) {
            console.log(err.message);
            return error(500, {reason: "Internal Error", details: "Encountered Unexpected Error"});
        }
    }
    public async logout(
        req: any,
        session_id: string, 
        response: TsoaResponse<404, { reason: string, details: string }>, 
        error: TsoaResponse<500, { reason: string, details: string }>
    ) : Promise<any> {
        try {
            // const result = await Session.deleteOne( {"_id": session_id} );
            // if (result.acknowledged && result.deletedCount == 1) return {success: true};  
            // else return response(404, {reason: "Session not found", details:"Session doesn't exist or already expired"});
            req.session.destroy(function(err: any) {
                // cannot access session here
            })
            
        } catch (err: any) {
            console.log(err.message);
            return error(500, {reason: "Internal Error", details: "Encountered Unexpected Error"});
        }
    }
}

export default new AuthService();