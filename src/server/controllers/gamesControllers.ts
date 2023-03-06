import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../CustomError/CustomError.js";
import Game from "../../database/models/Game.js";

export const getGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const games = await Game.find().exec();

    res.status(200).json({ games });
  } catch (error) {
    next(new CustomError(error as string, 500, "Couldn't retrieve games."));
  }
};
