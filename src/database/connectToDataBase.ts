import mongoose from "mongoose";
import errors from "../server/constants/errors.js";

const connectToDatabase = async (url: string) => {
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(url);
  } catch (error) {
    throw new Error(errors.serverError.databaseMessage);
  }
};

export default connectToDatabase;
