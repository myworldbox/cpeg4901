import * as init from "../_service/init"

export const root: init.express.RequestHandler = async (req: any, res: any, next: any) => res.status(200).send(init.config.project)