const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: String,
  text: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  published: { type: Boolean, default: true },
  dateAdded: { type: Date, default: Date.now },
  img: {
    url: String,
    publicId: String
  }
});

BlogSchema.virtual('dateAddedFormatted').get(function () {
  return DateTime.fromJSDate(this.dateAdded).toLocaleString(DateTime.DATETIME_FULL);
});

module.exports = mongoose.model('Blog', BlogSchema);
