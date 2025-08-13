export class PersistentLogger {
  private static logs: string[] = [];
  private static maxLogs = 1000;

  static log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] LOG: ${message} ${
      data ? JSON.stringify(data) : ''
    }`;
    console.log(logEntry);
    this.addToBuffer(logEntry);
  }

  static error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    const errorMsg =
      error?.message || error?.toString() || JSON.stringify(error) || '';
    const logEntry = `[${timestamp}] ERROR: ${message} ${errorMsg}`;
    console.error(logEntry);
    this.addToBuffer(logEntry);

    // Also log stack trace if available
    if (error?.stack) {
      const stackEntry = `[${timestamp}] STACK: ${error.stack}`;
      console.error(stackEntry);
      this.addToBuffer(stackEntry);
    }
  }

  static warn(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] WARN: ${message} ${
      data ? JSON.stringify(data) : ''
    }`;
    console.warn(logEntry);
    this.addToBuffer(logEntry);
  }

  static info(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] INFO: ${message} ${
      data ? JSON.stringify(data) : ''
    }`;
    console.info(logEntry);
    this.addToBuffer(logEntry);
  }

  private static addToBuffer(logEntry: string) {
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  static getLogs(): string[] {
    return [...this.logs];
  }

  static getRecentLogs(count = 50): string[] {
    return this.logs.slice(-count);
  }

  static clearLogs() {
    this.logs = [];
    this.info('Logs cleared');
  }

  static exportLogs(): string {
    return this.logs.join('\n');
  }
}