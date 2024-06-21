const asyncHandler = require('express-async-handler');
const passport = require('../utils/passport');
const { validationResult } = require('express-validator');
const { addTopicValidation } = require('../utils/validations');

const Blog = require('../models/blog');
const Comment = require('../models/comment');
const User = require('../models/user');
const Topic = require('../models/topic');

exports.getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find();

  res.json({ success: true, message: 'Topic sent', data: topics });
});

exports.addTopic = [
  passport.authenticate('jwt', { session: false }),

  ...addTopicValidation,

  asyncHandler(async (req, res) => {
    if (!req.user.author) {
      return res.status(401).json({ success: false, message: 'Unauthorized access.' });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ success: false, message: 'Error adding blog', errors: errors.array() });
    }

    const topic = new Topic({
      title: req.body.title
    });

    await topic.save();

    res.json({ success: true, message: 'Topic added', data: topic });
  })
];

exports.getTopicBlogs = asyncHandler(async (req, res) => {
  const topicBlogs = await Blog.find({ topic: req.params.topicId }).populate('topic').exec();

  res.json({ success: true, message: 'Topic blogs retrieved', data: topicBlogs })
});

exports.updateTopic = [
  passport.authenticate('jwt', { session: false }),

  ...addTopicValidation,

  asyncHandler(async (req, res) => {
    if (!req.user.author) {
      return res.status(401).json({ success: false, message: 'Unauthorized access.' });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ success: false, message: 'Error adding blog', errors: errors.array() });
    }

    const topic = {
      title: req.body.title,
      _id: req.params.topicId
    };

    const result = await Topic.findByIdAndUpdate(req.params.topicId, topic, { new: true, runValidators: true }).exec();

    res.json({ success: true, message: 'Topic updated', data: result });
  })
];

exports.deleteTopic = [
  passport.authenticate('jwt', { session: false }),

  asyncHandler(async (req, res) => {
    if (!req.user.author) {
      return res.status(401).json({ success: false, message: 'Unauthorized access.' });
    }

    const result = await Topic.findByIdAndDelete(req.params.topicId);

    res.json({ success: true, message: 'Topic deleted', data: result });
  })
];
