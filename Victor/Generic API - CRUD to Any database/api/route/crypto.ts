import * as init from '../_service/init'

export const crypto: init.express.RequestHandler = async (req: any, res: any, request: any) => {

    try {
        var request = init.global.request_handler(req)
        var message: any

        if (request.service.action == "key") {

            message = await eval("init.service.crypto." + request.service.provider + "_" + request.service.action)(request)

        } else {

            var loader = JSON.parse(JSON.stringify(request))
            await Promise.all(

                Object.keys(request.data).map(async (key) => {

                    loader.data = { text: request.data[key] }
                    request.data[key] = await eval("init.service.crypto." + request.service.provider + "_" + request.service.action)((loader))
                }))
            message = request.data
        }

        res.status(200).send(init.global.check_password(request, () => JSON.stringify(message, null, '\t')))

    } catch (e) {
        console.error({ service_error: e })
        res.status(500).send(JSON.stringify(e))
    }
}