import { IDictionary } from "../dict";

export interface IUser {  
    login_name: string;
    display_name: string;
    password: string;
    email_verified: boolean;
    dtCreated: Date;
    dtUpdated: Date;
}

export default IUser;
