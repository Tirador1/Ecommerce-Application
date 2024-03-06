import express from "express";
import { config } from "dotenv";

import { initiateApp } from "./src/initiateApp.js";

config({
  path: "./config/.env",
});

const app = express();

initiateApp(app, express);

// - [6]  Refresh token concept ( recorded video will be uploaded to Google Drive )

// - [17]  Cancel order within  1 day after create the order  API
// - [18]  Create invoice to the created order and send it on email( recorded video will be uploaded to Google Drive )
// - [19]  Reviews model ( recorded video will be uploaded to Google Drive )
// - [20]  Add Review API ( recorded video will be uploaded to Google Drive )
// - [21]  Delete Review API
// - [22]  Get all reviews for specific product
// - [23]  Disable/Enable Coupon API , if the coupon disabled it will not be used in any order
// - [24]  add in coupon model fields(disabledAt, disabledBy, enabledBy, enabledAt)  to track the user who disabled the coupon and the date of disable
// - [25]  Get all disabled coupons
// - [26]  Get all enabled coupons
// - [27]  Apply the API features in Coupons
// - [28]  Get coupon by id
// - [29]  Update  Coupon
