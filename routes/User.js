const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const User = require("../models/user");
const Product = require("../models/product");
const JWT = require("jsonwebtoken");
userRouter.use(passport.initialize());
// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "SecretKeyIsSecret",
      sub: userID,
    },
    "SecretKeyIsSecret",
    { expiresIn: "1d" }
  );
};

userRouter.post("/register", (req, res) => {
  const { email, password, role, firstName } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err)
      res
        .status(500)
        .json({ message: { msgBody: "Error has occured", msgError: "true" } });
    // check if there's existing user
    if (user)
      res.status(400).json({
        message: { msgBody: "User already exsits", msgError: "true" },
      });
    else {
      const NewUser = new User({ email, password, role, firstName });
      NewUser.save((err) => {
        if (err)
          res.status(500).json({
            message: { msgBody: "Error saving user", msgError: "true" },
          });
        else
          res.status(201).json({
            message: {
              msgBody: "account successfully created",
              msgError: "false",
            },
          });
      });
    }
  });
});

userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  function (req, res) {
    if (req.isAuthenticated()) {
      const { _id, email, role } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      // http Only => on client side cannot touch cookie using js, prevent crosside scripting attacks
      // same site => prevent crosside request attacks

      res.status(200).json({ isAuthenticated: true, user: { email, role } });
    }
  }
);

userRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    req.logout();
    res.clearCookie("access_token");
    res.json({ user: { email: " ", role: " " }, success: true });
  }
);

userRouter.post(
  "/newProduct",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    const product = new Product(req.body);
    product.save((err) => {
      if (err)
        res
          .status(500)
          .json({ message: { msgBody: "Error has ocurred", msgError: true } });
      else {
        req.user.products.push(product);
        req.user.save((err) => {
          if (err)
            res.status(500).json({
              message: { msgBody: "Error has ocurred", msgError: true },
            });
          else
            res.status(200).json({
              message: {
                msgBody: "successfully created product",
                msgError: false,
              },
            });
        });
      }
    });
  }
);

userRouter.get(
  "myProducts",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    User.findById({ _id: req.user._id })
      .populate("products")
      .exec((err, document) => {
        if (err)
          res.status(500).json({
            message: { msgBody: "Error has ocurred", msgError: true },
          });
        else {
          res
            .status(200)
            .json({ products: document.products, authenticated: true });
        }
      });
  }
);

module.exports = userRouter;
