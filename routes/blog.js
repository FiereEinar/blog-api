const express = require('express');
const router = express.Router();

const {
  blogList,
  addBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getBlogComments,
  addCommentToBlog,
  updateBlogComment,
  deleteBlogComment,
  hideComment,
} = require('../controllers/blogController');

router.get('/', blogList);

router.post('/', addBlog);

router.put('/:blogId', updateBlog);

router.delete('/:blogId', deleteBlog);

router.get('/:blogId', getBlog);

// Comments
router.get('/:blogId/comments', getBlogComments);

router.post('/:blogId/comments', addCommentToBlog);

router.put('/:blogId/comments/:commentId', updateBlogComment);

router.put('/:blogId/comments/:commentId/hide', hideComment);

router.delete('/:blogId/comments/:commentId', deleteBlogComment);

module.exports = router;
