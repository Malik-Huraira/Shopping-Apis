const fs = require("fs");
const moment = require("moment");

const LOG_FILE = "log.txt";

const logActivity = (username, action, status) => {
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const logEntry = `[${timestamp}] User: ${username} - Action: ${action} - Status: ${status}\n`;

    fs.appendFile(LOG_FILE, logEntry, (err) => {
        if (err) console.error("Error writing to log file:", err);
    });
};

module.exports = logActivity;
