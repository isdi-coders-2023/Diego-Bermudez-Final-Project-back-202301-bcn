import "./loadEnvironment.js";
import createDebug from "debug";
import chalk from "chalk";
import connectToDatabase from "./database/connectToDataBase.js";
import startServer from "./server/startServer.js";
import successes from "./server/constants/successes.js";

export const debug = createDebug("Back2Game:serverConnection");

const port = process.env.PORT ?? 4000;
const mongoDbUrl = process.env.MONGODB_URL_CONNECTION;

const connectionMessage = chalk.bold(successes.accepted.database);
const listeningMessage = (port: number | string) =>
  chalk.bold(`Server listening on port ${port}`);

try {
  await connectToDatabase(mongoDbUrl!);
  debug(chalk.bgGreen(connectionMessage));

  await startServer(port as number);
  debug(chalk.bgGreen(listeningMessage(port)));
} catch (error) {
  debug(chalk.bgRed(error.message));
}
