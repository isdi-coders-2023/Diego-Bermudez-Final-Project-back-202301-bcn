import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { type Response, type Request } from "express";
import request from "supertest";
import User from "../../database/models/User.js";
import { loginUser } from "./usersControllers.js";
import { type UserStructure } from "../../types.js";
import { app } from "../index.js";

const mockedUser = {
  username: "di3boss",
  password: "123456789",
  email: "",
};

describe("Given a POST 'users/login' endpoint", () => {
  describe("When it receives a login request with username 'di3boss' and password '123456789'", () => {
    test("Then it should respond with status code '200' and its json method with a token", async () => {
      const expectedStatusCodeOk = 200;
      const mockedHasedPasswordCompareResult = true;

      const request = {} as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response<unknown>;

      const expectedToken = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };

      request.body = {
        username: mockedUser.username,
        password: mockedUser.password,
      } as Partial<Request>;

      const next = jest.fn();

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
});
