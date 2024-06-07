const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, minLength: 1, maxLength: 50 },
  lastName: { type: String, minLength: 1, maxLength: 50 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profile: {
    imgUrl: String,
    imgPublicId: String
  },
  author: { type: Boolean, default: false }
});

UserSchema.virtual('fullname').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', UserSchema);
