const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.use(cookieParser());
app.use(express.json());

mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("successfully connected to database");
  }
);

//test if mongoose is working , no needed we can delete
// const User = require("./models/user");

// const userInput = {
//   email: "HelloTest1@email.com",
//   password: "1234567",
//   role: "admin",
// };

// const user = new User(userInput);
// user.save((err, document) => {
//   if (err) console.log(err, "error ligne 32");
//   console.log(document);
// });

const userRouter = require("./routes/User");
app.use("/user", userRouter);

app.listen(port, () => {
  console.log("express server started");
});
