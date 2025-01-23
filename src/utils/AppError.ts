class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    errName?: string;
    message: string;

    constructor(message: string, statusCode: number, errName?: string) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      this.errName = errName;
      this.message = message;
      Error.captureStackTrace(this);
    }
  }

export default AppError;