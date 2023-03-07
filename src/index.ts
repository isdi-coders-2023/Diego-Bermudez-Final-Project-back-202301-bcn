import chalk from "chalk";
import createDebug from "debug";
import connectToDatabase from "./database/models/connectToDataBase.js";
import "./loadEnvironment.js";
import startServer from "./server/startServer.js";

export const debug = createDebug("Back2Game:serverConnection");

const port = process.env.PORT ?? 4000;
const mongoDbUrl = process.env.MONGODB_URL_CONNECTION;

const connectionMessage = chalk.bold("Connected to data base");
const listeningMessage = (port: number | string) =>
  chalk.bold(`Server listening on port ${port}`);

try {
  await connectToDatabase(mongoDbUrl!);
  debug(connectionMessage);

  await startServer(port as number);
  debug(listeningMessage(port));
} catch (error) {
  debug(error.message as string);
}
