// authentication middleware
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./models/user");

const cookieExtractor = function (req) {
  const token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(cookieExtractor);
opts.secretOrKey = "SecretKeyIsSecret";

//middleware for authorisation to protect endpoints like personal pannel

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    // payload is seted data
    //check if user exist
    User.findOne({ _id: jwt_payload.sub }, (err, user) => {
      if (err) return done(err, false);
      if (user)
        // we already been authenticated no need to check password as is done below, if not he would not have a jwt token
        return done(null, user);
      else return done(null, false);
    });
  })
);

//authenticated local strategy using username and password

passport.use(
  new localStrategy(
    // {
    //   usernameField: "email",
    //   passwordField: "password",
    // },
    function (username, password, done) {
      // check if user exist
      User.findOne({ username }, (err, user) => {
        // something went wrong with db
        if (err) return done(err);
        // if no user exist
        if (!user) return done(null, false);
        //found user, check if password is correct
        user.comparePassword(password, done);
      });
    }
  )
);
