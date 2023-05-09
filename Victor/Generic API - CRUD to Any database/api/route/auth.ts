import * as init from '../_service/init'

export const auth: init.express.RequestHandler = async (req: any, res: any, next: any) => {

    try {
        var request = init.global.request_handler(req)

        await eval("init.service." + request.service.provider + "." + request.service.provider + "_connect")(request)

        var message = await eval("init.service." + request.service.provider + "." + request.service.provider + "_" + request.service.action)(request)

        res.status(200).send(init.global.check_password(request, () => JSON.stringify(message, null, '\t')))

    } catch (e) {

        console.error({ service_error: e })
        res.status(500).send(JSON.stringify(e))
    }
}