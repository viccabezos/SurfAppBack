// const express = require("express");
// const userRouter = express.Router();
// const passport = require("passport");
// const passportConfig = require("../passport");
// const User = require("../models/user");
// const Product = require("../models/product");
// const JWT = require("jsonwebtoken");
// userRouter.use(passport.initialize());

// userRouter.post(
//   "/newProduct",
//   passport.authenticate("jwt", { session: false }),
//   function (req, res) {
//     const product = new Product(req.body);
//     product.save((err) => {
//       if (err)
//         res.status(500).json({
//           message: { msgBody: "Error has occured", msgError: "true" },
//         });
//       else {
//         req.user.products.push(product);
//         req.user.save((err) => {
//           if (err)
//             res.status(500).json({
//               message: { msgBody: "Error has occured", msgError: "true" },
//             });
//           else
//             res.status(200).json({
//               message: {
//                 msgBody: "successfully created product",
//                 msgError: false,
//               },
//             });
//         });
//       }
//     });
//   }
// );

// module.exports = userRouter;
