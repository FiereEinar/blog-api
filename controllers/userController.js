const asyncHandler = require('express-async-handler');
const { updateUserValidation } = require('../utils/validations');
const passport = require('../utils/passport');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs/promises');
const { validationResult } = require('express-validator');

const Blog = require('../models/blog');
const Comment = require('../models/comment');
const User = require('../models/user');
const Topic = require('../models/topic');

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId, 'firstName lastName email profile').exec();

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ data: user });
});

exports.updateUserById = [
  passport.authenticate('jwt', { session: false }),

  upload.single('profileImg'),

  ...updateUserValidation,

  asyncHandler(async (req, res) => {
    const { firstName, lastName, email } = req.body;

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.json({ success: false, message: errors[0].msg });
    }

    let profileUrl = req.user.profile.imgUrl;
    let profilePrublicId = req.user.profile.imgPublicId;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      profileUrl = result.secure_url;
      profilePrublicId = result.public_id;

      await cloudinary.uploader.destroy(req.user.profile.imgPublicId);

      await fs.unlink(req.file.path);
    }

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      profile: {
        imgUrl: profileUrl,
        imgPublicId: profilePrublicId
      },
      _id: req.params.userId
    });

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, user, { new: true }).exec();

    return res.json({ data: updatedUser });
  })
];
