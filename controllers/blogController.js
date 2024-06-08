const asyncHandler = require('express-async-handler');
const passport = require('../utils/passport');
const Blog = require('../models/blog');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs/promises');

exports.blogList = asyncHandler(async (req, res) => {
  const blogs = await Blog.find();

  res.json({ blogs });
});

exports.addBlog = [
  passport.authenticate('jwt', { session: false }),

  upload.single('blogImage'),

  asyncHandler(async (req, res) => {
    if (!req.user.author) {
      res.status(401).json({ message: 'Unauthorized access.' });
    }

    let imgUrl = '';
    let imgPublicId = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      imgUrl = result.secure_url;
      imgPublicId = result.public_id;

      fs.unlink(req.file.path);
    }

    const { title, text } = req.body;

    const blog = new Blog({
      title: title,
      text: text,
      creator: req.user._id,
      img: {
        url: imgUrl,
        publicId: imgPublicId
      }
    });

    res.json({ message: 'blog added', user: req.user, blog });
  })
];

exports.updateBlog = [
  passport.authenticate('jwt', { session: false }),

  asyncHandler(async (req, res) => {
    // logic to update a blog

    res.json({ message: 'blog updated' });
  })
];

exports.deleteBlog = asyncHandler(async (req, res) => {
  res.json({ message: 'blog deleted' });
});

exports.getBlog = asyncHandler(async (req, res) => {
  res.json({ message: 'single blog' });
});
