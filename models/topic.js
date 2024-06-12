const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  title: { type: String, minLength: 3, required: true }
});

module.exports = mongoose.model('Topic', TopicSchema);
