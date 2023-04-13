const corsOriginList = ['localhost:4200', 'localhost:3600'];

exports.corsOptions = {
    preflightContinue: true,
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Origin', 'origin', 'x-request-with', 'X-Requested-With', 'Content-Type', 'Accept', 'accept', 'content-type', 'application/json', 'multipart/form-data'],
    origin: (origin, callback) => {
        console.log("im here \n \n")
        console.log(origin)
        if (corsOriginList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        };
    }
};
