const asyncHandler = require('express-async-handler');

exports.blogList = asyncHandler(async (req, res) => {
  res.json({ message: 'blog list' });
});

exports.addBlog = asyncHandler(async (req, res) => {
  res.json({ message: 'blog added' });
});

exports.updateBlog = asyncHandler(async (req, res) => {
  res.json({ message: 'blog updated' });
});

exports.deleteBlog = asyncHandler(async (req, res) => {
  res.json({ message: 'blog deleted' });
});
