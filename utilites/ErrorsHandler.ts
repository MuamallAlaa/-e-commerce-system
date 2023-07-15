class errorfeatures extends Error {
  isOperational: Boolean;
  status: string;
  statusCode: number;
  constructor(message: any, statusCode: any) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "Error";
    this.isOperational = true;
  }
}
module.exports = errorfeatures;
