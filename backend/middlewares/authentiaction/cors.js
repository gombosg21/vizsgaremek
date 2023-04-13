const corsOriginList = ['localhost:4200','http://localhost:4200', 'localhost:3600','http://localhost:3600'];

exports.corsOptions = {
    preflightContinue: true,
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS','PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['authorization'],
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
