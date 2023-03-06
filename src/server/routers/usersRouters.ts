import { Router } from "express";
import { getUsers } from "../controllers/usersControllers";

// eslint-disable-next-line new-cap
const usersRouter = Router();

usersRouter.get("/", getUsers);

export default usersRouter;
