const asyncHandler = require('express-async-handler');
const passport = require('../utils/passport');

exports.blogList = asyncHandler(async (req, res) => {
  res.json({ message: 'blog list' });
});

exports.addBlog = [
  passport.authenticate('jwt', { session: false }),

  asyncHandler(async (req, res) => {
    res.json({ message: 'blog added', user: req.user });
  })
];

exports.updateBlog = asyncHandler(async (req, res) => {
  res.json({ message: 'blog updated' });
});

exports.deleteBlog = asyncHandler(async (req, res) => {
  res.json({ message: 'blog deleted' });
});

exports.getBlog = asyncHandler(async (req, res) => {
  res.json({ message: 'single blog' });
});
