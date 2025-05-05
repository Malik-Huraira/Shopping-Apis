module.exports = {
    app: {
        name: 'API-Gateway',
        port: process.env.PORT ,
        baseUrl: process.env.BASE_URL 
    },
    services: {
        auth: process.env.AUTH_SERVICE_URL,
        order: process.env.ORDER_SERVICE_URL,
        product: process.env.PRODUCT_SERVICE_URL,
        user: process.env.USER_SERVICE_URL
    },
    ssl: {
        keyPath: process.env.SSL_KEY_PATH ,
        certPath: process.env.SSL_CERT_PATH 
    },
    logging: {
        level: process.env.LOG_LEVEL ,
        file: process.env.LOG_FILE ,
        errorFile: process.env.LOG_ERROR_FILE
    }
};