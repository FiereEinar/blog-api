const asyncHandler = require('express-async-handler');
const passport = require('../utils/passport');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs/promises');
const { validationResult } = require('express-validator');
const { addCommentValidation } = require('../utils/validations');

const Blog = require('../models/blog');
const Comment = require('../models/comment');
const User = require('../models/user');

exports.getBlogComments = asyncHandler(async (req, res) => {
  const blogComments = await Comment.find({ _id: req.params.blogId }).exec();

  res.json({ success: true, message: 'Blog comments', blogComments });
});

exports.addCommentToBlog = [
  passport.authenticate('jwt', { session: false }),

  ...addCommentValidation,

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ success: false, message: 'Error adding comment', errors: errors.array() });
    }

    const comment = new Comment({
      text: req.body.text,
      creator: req.user
    });

    await comment.save();

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.blogId, { $push: { comments: comment._id } }, { new: true }).exec();

    res.json({ success: true, message: 'Comment added to blog', commentId: comment._id, updatedBlog });
  })
];

exports.updateComment = [
  passport.authenticate('jwt', { session: false }),

  asyncHandler(async (req, res) => {

    res.json({ success: true, message: 'Blog comment updated' });
  })
];

exports.deleteComment = [
  passport.authenticate('jwt', { session: false }),

  asyncHandler(async (req, res) => {
    const result = await Comment.findByIdAndDelete(req.params.commentId);

    await Blog.findByIdAndUpdate()

    res.json({ success: true, message: 'Blog comment deleted', result });
  })
];
