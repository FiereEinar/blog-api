const passport = require('passport');
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY
};

passport.use(new JwtStrategy(
  opts,
  async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.user._id);

      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
      }

    } catch (err) {
      return done(err, false);
    };
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  };
});

module.exports = passport;
