const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const serviceAccount = require("./nkartik01-ecommerce-firebase-adminsdk-4kuz5-196c792255.json");
admin.initializeApp(serviceAccount);
app.use(cors());
app.use(bodyParser.json());
app.use("/auth", require("./auth"));
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.api = functions.https.onRequest(app);
