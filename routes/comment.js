const express = require('express');
const router = express.Router();

const {
  getBlogComments,
  addCommentToBlog,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

router.get('/blog/:blogId', getBlogComments);

router.post('/blog/:blogId', addCommentToBlog);

router.put('/:commentId', updateComment);

router.delete('/:commentId', deleteComment);

module.exports = router;
