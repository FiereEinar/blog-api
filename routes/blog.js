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

router.put('/:blogId', updateBlog);

router.delete('/:blogId', deleteBlog);

router.get('/:blogId', getBlog);

module.exports = router;
