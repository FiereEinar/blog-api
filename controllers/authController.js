require('dotenv').config();
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginGet = asyncHandler(async (req, res) => {
  res.json({ message: 'login get' })
});

exports.loginPost = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    return res.status(404).json({ message: 'User not found', email, password });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

  res.json({ token, userId: user._id });
});

exports.signupGet = asyncHandler(async (req, res) => {
  res.json({ message: 'signup get' })
});

exports.signupPost = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT), async (err, hashedPassword) => {
    if (err) return next(err);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      profile: {
        imgUrl: '',
        imgPublicId: ''
      },
    });

    await user.save()

    res.json(user);
  });
});
