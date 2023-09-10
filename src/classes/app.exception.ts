import { IAppError } from "../interfaces/app_error";

export class AppException extends Error implements IAppError {
  code: number;

  constructor(appError: IAppError) {
    super(appError.message);
    this.code = appError.code;
  }
}
