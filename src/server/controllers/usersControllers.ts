import { type NextFunction, type Response, type Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../database/models/User.js";
import { type UserStructure } from "../../types.js";
import { type CustomJwtPayload } from "./types.js";
import CustomError from "../../CustomError/CustomError.js";

export const loginUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserStructure>,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error = new CustomError(
        "Unauthorized: User not found",
        401,
        "Unauthorized: User not found"
      );
      next(error);
      return;
    }

    const jsonWebTokenPayload: CustomJwtPayload = {
      sub: user._id.toString(),
      username: user.username,
    };

    const token = jwt.sign(jsonWebTokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "3d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
