import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { type Response, type Request, type NextFunction } from "express";
import User from "../../database/models/User.js";
import { loginUser } from "./usersControllers.js";
import { type CustomRequest } from "../../types.js";
import CustomError from "../../CustomError/CustomError.js";
import connectToDatabase from "../../database/connectToDataBase.js";
import errors from "../constants/errors.js";
import successes from "../constants/successes.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given a POST 'users/login' endpoint", () => {
  const mockedUser = {
    username: "di3boss",
    password: "123456789",
    email: "",
  };

  const request: Partial<Request> = {};

  const response: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  request.body = {
    username: mockedUser.username,
    password: mockedUser.password,
  };

  const next = jest.fn() as NextFunction;

  describe("When it receives a login request with username 'di3boss' and password '123456789'", () => {
    test("Then it should respond with status code '200' and its json method with a token", async () => {
      const { statusCode } = successes.ok;
      const mockedHasedPasswordCompareResult = true;

      const expectedToken = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({
          ...request.body,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest
        .fn()
        .mockResolvedValue(mockedHasedPasswordCompareResult);
      jwt.sign = jest.fn().mockReturnValue(expectedToken.token);

      await loginUser(request as CustomRequest, response as Response, next);

      expect(response.status).toHaveBeenCalledWith(statusCode);
      expect(response.json).toHaveBeenCalledWith(expectedToken);
    });
  });

  describe("when it receives a request with a password that doesn't exist in the database", () => {
    test("Then it should call its next method with a status code 401 and a message 'Unauthorized: User not found'", async () => {
      const mockedWrongUser = {
        username: "di3boss",
        password: "wr0ngPassw0rd",
        email: "",
      };

      const expectedError = new CustomError(
        errors.unauthorized.message,
        errors.unauthorized.statusCode,
        errors.unauthorized.publicMessage
      );

      request.body = mockedWrongUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockedWrongUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(request as CustomRequest, response as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
