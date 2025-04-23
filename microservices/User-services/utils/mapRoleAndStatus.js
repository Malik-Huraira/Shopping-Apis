const db = require("../config/db");

async function mapRoleAndStatus(role, status) {
    try {
        const [roleResult] = await db.query("SELECT id FROM roles WHERE LOWER(role_name) = LOWER(?)", [role]);
        const [statusResult] = await db.query("SELECT id FROM statuses WHERE LOWER(status_name) = LOWER(?)", [status]);

        return {
            roleId: roleResult[0]?.id || null,
            statusId: statusResult[0]?.id || null,
        };
    } catch (error) {
        console.error("Error mapping role and status:", error);
        return { roleId: null, statusId: null };
    }
}


module.exports = mapRoleAndStatus;
