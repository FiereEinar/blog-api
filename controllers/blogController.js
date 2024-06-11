const asyncHandler = require('express-async-handler');
const passport = require('../utils/passport');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const User = require('../models/user');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs/promises');
const path = require('path')

exports.blogList = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().populate('comments').populate('creator').exec();

  res.json(blogs);
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

      await fs.unlink(req.file.path);
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

    const oldBlog = await Blog.findById(req.params.blogId).populate('creator');
    if (!oldBlog) {
      return res.status(404).json({ sucess: false, message: 'Blog not found.' });
    }

    if (oldBlog.creator._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ sucess: false, message: 'Current user has no rights to edit this blog.' });
    }

    let imgUrl = oldBlog.img.url;
    let imgPublicId = oldBlog.img.publicId;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      imgUrl = result.secure_url;
      imgPublicId = result.public_id;

      await cloudinary.uploader.destroy(oldBlog.img.publicId);

      await fs.unlink(req.file.path);
    }

    const { title, text, published } = req.body;

    const blog = new Blog({
      title: title,
      text: text,
      published: published || oldBlog.published,
      img: {
        url: imgUrl,
        publicId: imgPublicId
      },
      _id: oldBlog._id
    });

    // it returns the old blog and NOT the update blog for some reason?
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
    await cloudinary.uploader.destroy(blogExists.img.publicId)

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
