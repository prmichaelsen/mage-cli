import Yargs from "yargs";
const yargs: Yargs.Argv = require("yargs");

export const cli = yargs.demandCommand(1);
