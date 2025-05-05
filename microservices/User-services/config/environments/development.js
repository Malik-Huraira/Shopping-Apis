module.exports = {
    app: {
        name: 'User-services',
        port: process.env.PORT ,
        baseUrl: process.env.BASE_URL 
    },
    db: {
        host: process.env.DB_HOST ,
        port: process.env.DB_PORT ,
        name: process.env.DB_NAME,
        user: process.env.DB_USER ,
        password: process.env.DB_PASSWORD
    },
    jwt: {
        secret: process.env.JWT_SECRET ,
        expiresIn: process.env.JWT_EXPIRES
    },
    services: {
        emailService: process.env.EMAIL_SERVICE_URL,
    }
};