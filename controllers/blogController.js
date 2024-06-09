const asyncHandler = require('express-async-handler');
const passport = require('../utils/passport');
const Blog = require('../models/blog');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs/promises');

exports.blogList = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().populate('comments').populate('creator').exec();

  res.json({ blogs });
});

exports.addBlog = [
  passport.authenticate('jwt', { session: false }),

  upload.single('blogImage'),

  asyncHandler(async (req, res) => {
    if (!req.user.author) {
      return res.status(401).json({ sucess: false, message: 'Unauthorized access.' });
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

    blog.save();

    res.json({ sucess: true, message: 'Blog added', user: req.user, blog });
  })
];

exports.updateBlog = [
  passport.authenticate('jwt', { session: false }),

  upload.single('blogImage'),

  asyncHandler(async (req, res) => {
    if (!req.user.author) {
      return res.status(401).json({ sucess: false, message: 'Unauthorized access.' });
    }

    const oldBlog = await Blog.findById(req.params.blogId);
    if (!oldBlog) {
      return res.status(404).json({ sucess: false, message: 'Blog not found.' });
    }

    let imgUrl = oldBlog.img.url;
    let imgPublicId = oldBlog.img.publicId;

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
      img: {
        url: imgUrl,
        publicId: imgPublicId
      },
      _id: oldBlog._id
    });

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.blogId, blog, {});

    res.json({ sucess: true, message: 'blog updated', updatedBlog });
  })
];

exports.deleteBlog = [
  passport.authenticate('jwt', { session: false }),

  asyncHandler(async (req, res) => {
    if (!req.user.author) {
      return res.status(401).json({ sucess: false, message: 'Unauthorized access.' });
    }

    const blogExists = await Blog.exists({ _id: req.params.blogId }).exec();

    if (!blogExists) {
      return res.status(404).json({ sucess: false, message: 'Blog not found.' });
    }

    await Blog.findByIdAndDelete(req.params.blogId);

    res.json({ sucess: true, message: 'Blog deleted' });
  })
];

exports.getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.blogId);

  if (!blog) {
    return res.status(404).json({ sucess: false, message: 'Blog not found.' });
  }

  res.json({ sucess: true, message: 'Blog found', blog });
});
