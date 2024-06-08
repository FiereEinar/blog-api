const express = require('express');
const router = express.Router();

const {
  loginGet,
  loginPost,
  signupGet,
  signupPost
} = require('../controllers/authController');

router.get('/login', loginGet);

router.post('/login', loginPost);

router.get('/signup', signupGet);

router.post('/signup', signupPost);

module.exports = router;
