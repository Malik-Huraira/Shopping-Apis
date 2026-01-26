const fs = require("fs");
const path = require("path");
const moment = require("moment");

const LOG_DIR = path.join(__dirname, "../logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");
const ERROR_LOG_FILE = path.join(LOG_DIR, "error.log");

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const getCurrentLogLevel = () => {
  const level = process.env.LOG_LEVEL || "info";
  return LOG_LEVELS[level] || LOG_LEVELS.info;
};

const formatLog = (level, message, data = {}) => {
  const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
  const format = process.env.LOG_FORMAT || "json";

  // Handle circular references and error objects
  const safeStringify = (obj) => {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, val) => {
      if (val != null && typeof val === "object") {
        if (seen.has(val)) {
          return "[Circular]";
        }
        seen.add(val);

        // Handle Error objects specially
        if (val instanceof Error) {
          return {
            name: val.name,
            message: val.message,
            stack: val.stack,
            code: val.code,
            errno: val.errno,
            syscall: val.syscall,
            hostname: val.hostname,
            port: val.port,
          };
        }
      }
      return val;
    });
  };

  if (format === "json") {
    return safeStringify({
      timestamp,
      level,
      message,
      ...data,
    });
  }

  return `[${timestamp}] [${level.toUpperCase()}] ${message} ${Object.keys(data).length > 0 ? safeStringify(data) : ""}`;
};

const writeLog = (level, message, data = {}, isError = false) => {
  if (LOG_LEVELS[level] > getCurrentLogLevel()) {
    return;
  }

  const logEntry = formatLog(level, message, data);
  const logFile = isError ? ERROR_LOG_FILE : LOG_FILE;

  // Async write to avoid blocking
  fs.appendFile(logFile, logEntry + "\n", (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });

  // Also log to console in development
  if (process.env.NODE_ENV === "development") {
    console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](
      logEntry,
    );
  }
};

const logger = {
  error: (message, data = {}) => writeLog("error", message, data, true),
  warn: (message, data = {}) => writeLog("warn", message, data),
  info: (message, data = {}) => writeLog("info", message, data),
  debug: (message, data = {}) => writeLog("debug", message, data),
};

module.exports = { logger };
