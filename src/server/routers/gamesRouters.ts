import { Router } from "express";
import { getGames } from "../controllers/gamesControllers.js";

const gamesRouter = Router();

gamesRouter.get("/", getGames);

export default gamesRouter;
