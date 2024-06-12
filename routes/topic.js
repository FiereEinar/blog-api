const express = require('express');
const router = express.Router();

const {
  getTopics,
  addTopic,
  updateTopic,
  deleteTopic,
} = require('../controllers/topicController');

router.get('/', getTopics);

router.post('/:topicId', addTopic);

router.put('/:topicId', updateTopic);

router.delete('/:topicId', deleteTopic);

module.exports = router;
