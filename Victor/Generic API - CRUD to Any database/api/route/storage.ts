import * as init from "../_service/init"

export const storage: init.express.RequestHandler = async (req: any, res: any, next: any) => {

    try {
        var request = init.global.request_handler(req)

        res.status(200).send(init.global.check_password(request, () => require(`../_json/${request.service.action}.json`)))

    } catch (e) {
        console.error({ service_error: e })
        res.status(500).send(JSON.stringify(e))
    }
}