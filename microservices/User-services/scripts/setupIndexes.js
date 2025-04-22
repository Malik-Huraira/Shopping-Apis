// Example using MySQL connection
const db = require('../config/db');

const queries = [
    // Users
    "CREATE INDEX idx_users_email ON users(email)",
    "CREATE INDEX idx_users_phone_number ON users(phone_number)",
    "CREATE INDEX idx_users_role ON users(role)",
    "CREATE INDEX idx_users_status ON users(status)",

    // Sessions
    "CREATE INDEX idx_sessions_token ON sessions(token)",
    "CREATE INDEX idx_sessions_user_id ON sessions(user_id)",
];

(async () => {
    for (let q of queries) {
        try {
            await db.query(q);
            console.log(`✅ Applied: ${q}`);
        } catch (err) {
            console.error(`❌ Error with: ${q}`, err.message);
        }
    }
})();
