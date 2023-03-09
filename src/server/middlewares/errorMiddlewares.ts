import "./loadEnvironment.js";
import createDebug from "debug";
import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../CustomError/CustomError.js";
import errors from "../constants/errors.js";

const debug = createDebug("Back2Game:Errors");

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError(
    errors.notFound.message,
    errors.notFound.statusCode,
    errors.notFound.publicMessage
  );

  debug(error.message);

  next(error);
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(error.message);

  res
    .status(error.statusCode || errors.serverError.statusCode)
    .json({ error: error.publicMessage || errors.serverError.publicMessage });
};
