import express from "express";
import morgan from "morgan";
import cors from "cors";
import options from "../cors.js";
import gamesRouter from "./routers/gamesRouters.js";

const gameEndpoint = "/games";

export const app = express();

app.disable("x-powered-by");

app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());

app.use(gameEndpoint, gamesRouter);
