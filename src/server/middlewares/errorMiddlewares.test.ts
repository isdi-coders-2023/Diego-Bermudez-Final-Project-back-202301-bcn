import { type NextFunction, type Request, type Response } from "express";
import { notFoundError } from "./errorMiddlewares.js";

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
