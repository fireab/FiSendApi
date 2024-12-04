import moment from "moment";

export class AppError {
  payload: any;
  statusCode: number;

  constructor(statusCode: number, errors: any[]) {
    this.statusCode = statusCode;
    this.payload = {
      timestamp: moment(),
      errors: errors,
    };
  }
}
