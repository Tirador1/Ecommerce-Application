import express from "express";
import { config } from "dotenv";

import { initiateApp } from "./src/initiateApp.js";

config({
  path: "./config/.env",
});

const app = express();

initiateApp(app, express);

// - [6]  Refresh token concept ( recorded video will be uploaded to Google Drive )

// - [18]  Create invoice to the created order and send it on email( recorded video will be uploaded to Google Drive )
// - [19]  Reviews model ( recorded video will be uploaded to Google Drive )
// - [20]  Add Review API ( recorded video will be uploaded to Google Drive )
// - [21]  Delete Review API
// - [22]  Get all reviews for specific product
