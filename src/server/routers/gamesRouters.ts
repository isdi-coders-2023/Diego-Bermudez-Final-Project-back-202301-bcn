import { Router } from "express";
import { getGames } from "../controllers/gamesControllers.js";

// eslint-disable-next-line new-cap
const gamesRouter = Router();

gamesRouter.get("/", getGames);

export default gamesRouter;
