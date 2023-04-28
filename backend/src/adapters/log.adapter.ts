class LogAdapter {
    info(msg: string, input?: LogContext) {
        console.info(msg, input);
    }

    warn(msg: string, input?: LogContext) {
        console.warn(msg, input);
    }

    error(msg: string, input?: LogContext) {
        console.error(msg, input);
    }
}

export const log = new LogAdapter();

enum LogSeverity {
    Fatal = 'fatal',
    Error = 'error',
    Warning = 'warning',
    Log = 'log',
    Info = 'info',
    Debug = 'debug',
    Critical = 'critical'
}

interface LogContext {
    error?: Error;
    level?: LogSeverity;
    tags?: { [key: string]: string };
    extra?: any;
}
