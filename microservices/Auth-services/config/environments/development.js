module.exports = {
    app: {
        name: 'Auth-Service',
        port: process.env.PORT || 5001,
        baseUrl: process.env.BASE_URL || 'http://localhost:5001'
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        name: process.env.DB_NAME || 'auth',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Qwerty@123'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'MY_SECURE_SECRET_12345',
        expiresIn: process.env.JWT_EXPIRES || '1d'
    },
    services: {
        emailService: process.env.EMAIL_SERVICE_URL || 'http://localhost:5002',
        userService: process.env.USER_SERVICE_URL || 'http://localhost:5005'
    }
};