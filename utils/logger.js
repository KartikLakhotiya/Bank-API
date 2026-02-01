/**
 * Logger Utility for Bank-API
 * Provides consistent, formatted logging throughout the application
 * Exports logs to dated text files in the logs directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '..', 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

const getTimestamp = () => {
    return new Date().toISOString();
};

const getDateString = () => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

let lastLogDate = null;

/**
 * Write log entry to file
 */
const writeToFile = (message) => {
    const dateString = getDateString();
    const logFilePath = path.join(logsDir, `logs-${dateString}.txt`);
    
    let logEntry = '';
    
    // Check if this is a new day or new file
    const fileExists = fs.existsSync(logFilePath);
    
    if (!fileExists) {
        // New file - add date header
        const formattedDate = getFormattedDate();
        logEntry = `========================================\n`;
        logEntry += `           ${formattedDate}\n`;
        logEntry += `========================================\n\n`;
        lastLogDate = dateString;
    } else if (lastLogDate !== dateString) {
        // Date changed during runtime - add separator and new date header
        const formattedDate = getFormattedDate();
        logEntry = `\n\n========================================\n`;
        logEntry += `           ${formattedDate}\n`;
        logEntry += `========================================\n\n`;
        lastLogDate = dateString;
    }
    
    logEntry += message + '\n';
    
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
};

const formatMessage = (level, module, message, data = null) => {
    const timestamp = getTimestamp();
    const baseLog = `[${timestamp}] [${level}] [${module}] ${message}`;
    if (data) {
        return `${baseLog} | Data: ${JSON.stringify(data)}`;
    }
    return baseLog;
};

const logger = {
    /**
     * Log informational messages
     */
    info: (module, message, data = null) => {
        const formattedMessage = formatMessage('INFO', module, message, data);
        console.log(`${colors.blue}${formattedMessage}${colors.reset}`);
        writeToFile(formattedMessage);
    },

    /**
     * Log success messages
     */
    success: (module, message, data = null) => {
        const formattedMessage = formatMessage('SUCCESS', module, message, data);
        console.log(`${colors.green}${formattedMessage}${colors.reset}`);
        writeToFile(formattedMessage);
    },

    /**
     * Log warning messages
     */
    warn: (module, message, data = null) => {
        const formattedMessage = formatMessage('WARN', module, message, data);
        console.log(`${colors.yellow}${formattedMessage}${colors.reset}`);
        writeToFile(formattedMessage);
    },

    /**
     * Log error messages
     */
    error: (module, message, error = null) => {
        const formattedMessage = formatMessage('ERROR', module, message);
        console.error(`${colors.red}${formattedMessage}${colors.reset}`);
        writeToFile(formattedMessage);
        if (error) {
            const errorStack = `[${getTimestamp()}] [ERROR] [${module}] Stack: ${error.stack || error}`;
            console.error(`${colors.red}${errorStack}${colors.reset}`);
            writeToFile(errorStack);
        }
    },

    /**
     * Log debug messages (only in development)
     */
    debug: (module, message, data = null) => {
        if (process.env.NODE_ENV !== 'production') {
            const formattedMessage = formatMessage('DEBUG', module, message, data);
            console.log(`${colors.magenta}${formattedMessage}${colors.reset}`);
            writeToFile(formattedMessage);
        }
    },

    /**
     * Log HTTP request details
     */
    request: (method, url, statusCode = null, duration = null) => {
        const timestamp = getTimestamp();
        let statusColor = colors.green;
        if (statusCode >= 400 && statusCode < 500) statusColor = colors.yellow;
        if (statusCode >= 500) statusColor = colors.red;
        
        let message = `[${timestamp}] [REQUEST] ${method} ${url}`;
        if (statusCode) message += ` | Status: ${statusCode}`;
        if (duration) message += ` | Duration: ${duration}ms`;
        
        console.log(`${statusColor}${message}${colors.reset}`);
        writeToFile(message);
    },

    /**
     * Log database operations
     */
    db: (operation, collection, data = null) => {
        const formattedMessage = formatMessage('DB', collection, operation, data);
        console.log(`${colors.cyan}${formattedMessage}${colors.reset}`);
        writeToFile(formattedMessage);
    },

    /**
     * Log authentication events
     */
    auth: (event, userId = null, details = null) => {
        const data = userId ? { userId, ...details } : details;
        const formattedMessage = formatMessage('AUTH', 'Authentication', event, data);
        console.log(`${colors.magenta}${formattedMessage}${colors.reset}`);
        writeToFile(formattedMessage);
    },

    /**
     * Log transaction events
     */
    transaction: (type, details) => {
        const formattedMessage = formatMessage('TRANSACTION', 'Banking', `${type} operation`, details);
        console.log(`${colors.bright}${colors.green}${formattedMessage}${colors.reset}`);
        writeToFile(formattedMessage);
    }
};

export default logger;
