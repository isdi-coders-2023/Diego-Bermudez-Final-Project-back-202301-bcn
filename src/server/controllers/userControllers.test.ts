import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { type Response, type Request, type NextFunction } from "express";
import User from "../../database/models/User.js";
import { loginUser } from "./usersControllers.js";
import { type UserStructure } from "../../types.js";
import CustomError from "../../CustomError/CustomError.js";
import connectToDatabase from "../../database/models/connectToDataBase.js";

let mongoBbServer: MongoMemoryServer;

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

  const request = {} as Request;

  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response<unknown>;

  request.body = {
    username: mockedUser.username,
    password: mockedUser.password,
  } as Partial<Request>;

  const next = jest.fn() as NextFunction;

  describe("When it receives a login request with username 'di3boss' and password '123456789'", () => {
    test("Then it should respond with status code '200' and its json method with a token", async () => {
      const expectedStatusCodeOk = 200;
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

      await loginUser(
        request as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserStructure
        >,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatusCodeOk);
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
        "Unauthorized: User not found",
        401,
        "Unauthorized: User not found"
      );

      request.body = mockedWrongUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockedWrongUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(
        request as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserStructure
        >,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
