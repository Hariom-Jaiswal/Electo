/**
 * Structured Cloud Logging helper.
 * Outputs JSON with a `severity` field so Google Cloud Logging can parse
 * severity levels, filter, and alert correctly.
 */

type Severity = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

interface LogEntry {
  severity: Severity;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

function writeLog(severity: Severity, message: string, context?: Record<string, unknown>): void {
  const entry: LogEntry = {
    severity,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  const line = JSON.stringify(entry);

  if (severity === 'ERROR') {
    console.error(line);
  } else if (severity === 'WARNING') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

/** Structured Cloud Logging client. Use instead of bare console.log/error. */
export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => writeLog('DEBUG', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => writeLog('INFO', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => writeLog('WARNING', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => writeLog('ERROR', msg, ctx),
};
