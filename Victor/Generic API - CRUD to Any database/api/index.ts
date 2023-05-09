import * as init from "./_service/init"

(async () => {

    var app: any = init["fastify"].default()  
    // var app = init["express"].default()
    
    await app.register(require('@fastify/express'))

    var server = app.listen({ port: init.config.port }, () => console.log(`[ Port <---> ${init.config.port} ]`))

    app.use(init.cors.default())
    app.use(init["express"].default.json())
    app.use(init["express"].urlencoded({ extended: true }))

    Object.keys(init.route).map((key: any, i: any) => i == 0 ? app.get(key, init.route[key]) : app.use(key, init.route[key]))

    /*
    var web_socket = new init.ws.Server({ server })

    web_socket.on('listening', (socket: any) => {

        console.log("web socket listening")
    });

    web_socket.on('connection', (socket: any) => {

        socket.on('message', (message: string) => {

            socket.send(`web socket message ---> ${message}`);
        });
        socket.send("init.firebase_auth.getAuth");
    });
    */
})()

