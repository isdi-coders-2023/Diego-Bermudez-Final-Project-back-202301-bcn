import { type Response, type Request, type NextFunction } from "express";
import Game from "../../database/models/Game.js";
import { CustomRequest } from "../../types.js";
import successes from "../constants/successes.js";
import { getGames } from "./gamesControllers.js";

const mockedGames = [
  {
    title: "Legend of Dragoon",
    platform: "PS5",
    genre: "RPG",
    description: "",
    price: "9.99",
    cover: "legend_of_dragon.png",
  },
  {
    title: "Gran Turismo 7",
    platform: "PS5",
    genre: "Simulation",
    description: "",
    price: "69.99",
    cover: "Gran_Turismo.jpg",
  },
];

describe("Given the getGames controller middlleware", () => {
  describe("WHen it receives a request from a user", () => {
    test("Then it should calls its status method with 200 code", async () => {
      const response: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockedGames),
      };

      const request: Partial<Request> = {};

      const next: NextFunction = jest.fn();

      const expectedCodeStatus = successes.ok.statusCode;

      Game.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockedGames),
      }));

      await getGames(request as Request, response as Response, next);

      expect(response.status).toHaveBeenCalledWith(expectedCodeStatus);
    });
  });
});
