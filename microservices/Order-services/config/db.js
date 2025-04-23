const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config(); 

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Qwerty@123',
    database: process.env.DB_NAME || 'orders',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
    .then(() => console.log("✅ Database connected successfully"))
    .catch(err => console.error("❌ Database connection failed:", err));

module.exports = db;
