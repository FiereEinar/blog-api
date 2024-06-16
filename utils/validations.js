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

exports.addTopicValidation = [
  body('title', 'Title should be atleast 3 characters.')
    .trim()
    .isLength({ min: 3 }),
];

exports.updateUserValidation = [
  body('firstName', 'First name should not be empty.')
    .trim()
    .notEmpty(),
  body('lastName', 'Last name should not be empty.')
    .trim()
    .notEmpty(),
  body('email', 'Email should not be empty and should be valid.')
    .trim()
    .notEmpty()
    .isEmail(),
];
