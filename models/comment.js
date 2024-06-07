const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, minLength: 3 },
  dateAdded: { type: Date, default: Date.now },
  hidden: { type: Boolean, default: false }
});

CommentSchema.virtual('dateAddedFormatted').get(function () {
  return DateTime.fromJSDate(this.dateAdded).toLocaleString(DateTime.DATETIME_FULL);
});

module.exports = mongoose.model('Comment', CommentSchema);
