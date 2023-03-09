import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../CustomError/CustomError.js";
import errors from "../constants/errors.js";
import { generalError, notFoundError } from "./errorMiddlewares.js";

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const request: Partial<Request> = {};

const next: NextFunction = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("Given the notFoundError middleware", () => {
  describe("When it receives a failed requeest", () => {
    test("Then it should call its next method", () => {
      notFoundError(request as Request, response as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a generalError middleware", () => {
  const error = new CustomError(
    errors.serverError.message,
    errors.serverError.statusCode,
    errors.serverError.publicMessage
  );
  const { statusCode } = errors.serverError;

  describe("When it receives an error with status 500", () => {
    test("Then it shoudl call its status method with a 500", () => {
      generalError(error, request as Request, response as Response, next);

      expect(response.status).toHaveBeenCalledWith(statusCode);
    });
  });

  describe("When it receives an error not specified", () => {
    test("then it should return a status code '500' and its json method with 'Something went wrong'", () => {
      const expectedErrorMessage = { error: errors.serverError.publicMessage };

      generalError(error, request as Request, response as Response, next);

      expect(response.status).toHaveBeenCalledWith(statusCode);
      expect(response.json).toHaveBeenCalledWith(expectedErrorMessage);
    });
  });
});
