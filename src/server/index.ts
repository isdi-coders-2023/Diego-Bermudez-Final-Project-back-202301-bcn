import express from "express";
import morgan from "morgan";
import cors from "cors";
import options from "../cors";
import usersRouter from "./routers/usersRouters";

const root = "/";
const userEndpoint = "/users";

export const app = express();

app.disable("x-powered-by");

app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());

app.use(userEndpoint, usersRouter);
