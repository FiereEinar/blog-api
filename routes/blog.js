const express = require('express');
const router = express.Router();

const {
  blogList,
  addBlog,
  updateBlog,
  deleteBlog,
  getBlog
} = require('../controllers/blogController');

router.get('/', blogList);

router.post('/', addBlog);

router.put('/:blogId/update', updateBlog);

router.delete('/:blogId/delete', deleteBlog);

router.get('/:blogId', getBlog);

module.exports = router;
