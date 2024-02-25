import express from "express";
import { config } from "dotenv";

import { initiateApp } from "./src/initiateApp.js";

config({
  path: "./config/.env",
});

const app = express();

initiateApp(app, express);
