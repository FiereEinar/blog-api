const { body } = require('express-validator');

exports.addCommentValidation = [
  body('text', 'Comment should be atleast 3 characters.')
    .trim()
    .isLength({ min: 3 }),
];

exports.addBlogValidation = [
  body('title', 'Title should be atleast 3 characters.')
    .trim()
    .isLength({ min: 3 }),
  body('text', 'Text should be atleast 3 characters.')
    .trim()
    .isLength({ min: 3 }),
];
