class errorfeatures extends Error {
  isOperational: Boolean;
  status: string;
  statusCode: Number;
  constructor(message: string, statusCode: Number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "Error";
    this.isOperational = true;
  }
}
export { errorfeatures };
