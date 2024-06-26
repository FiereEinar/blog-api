const asyncHandler = require('express-async-handler');
const passport = require('../utils/passport');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs/promises');

const Blog = require('../models/blog');
const Comment = require('../models/comment');
const User = require('../models/user');

const { validationResult } = require('express-validator');
const {
	addCommentValidation,
	addBlogValidation
} = require('../utils/validations');

exports.blogList = asyncHandler(async (req, res) => {
	const blogs = await Blog.find()
		.populate({
			path: 'creator',
			model: 'User',
			select: 'firstName lastName email profile'
		})
		.populate({
			path: 'comments',
			populate: {
				path: 'creator',
				model: 'User',
				select: 'firstName lastName email profile'
			}
		})
		.populate('topic')
		.exec();

	res.json({ data: blogs });
});

exports.addBlog = [
	passport.authenticate('jwt', { session: false }),

	upload.single('blogImage'),

	...addBlogValidation,

	asyncHandler(async (req, res) => {
		if (!req.user.author) {
			return res.status(401).json({ success: false, message: 'Unauthorized access.' });
		}

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ success: false, message: 'Error adding blog', errors: errors.array() });
		}

		let imgUrl = '';
		let imgPublicId = '';

		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path);

			imgUrl = result.secure_url;
			imgPublicId = result.public_id;

			await fs.unlink(req.file.path);
		}

		const { title, text, topicId, published } = req.body;

		const blog = new Blog({
			title: title,
			text: text,
			topic: topicId,
			published: published ? published : true,
			creator: req.user._id,
			img: {
				url: imgUrl,
				publicId: imgPublicId
			}
		});

		blog.save();

		res.json({ success: true, message: 'Blog added', data: blog });
	})
];

exports.updateBlog = [
	passport.authenticate('jwt', { session: false }),

	upload.single('blogImage'),

	...addBlogValidation,

	asyncHandler(async (req, res) => {
		if (!req.user.author) {
			return res.status(401).json({ success: false, message: 'Unauthorized access.' });
		}

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ success: false, message: 'Error adding blog', errors: errors.array() });
		}

		const oldBlog = await Blog.findById(req.params.blogId).populate('creator');
		if (!oldBlog) {
			return res.status(404).json({ success: false, message: 'Blog not found.' });
		}

		if (oldBlog.creator._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ success: false, message: 'Current user has no rights to edit this blog.' });
		}

		let imgUrl = oldBlog.img.url;
		let imgPublicId = oldBlog.img.publicId;

		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path);

			imgUrl = result.secure_url;
			imgPublicId = result.public_id;

			await cloudinary.uploader.destroy(oldBlog.img.publicId);

			await fs.unlink(req.file.path);
		}

		const { title, text, published, topicId } = req.body;

		const blog = {
			title: title,
			text: text,
			topic: topicId,
			published: published ? published : oldBlog.published,
			img: {
				url: imgUrl,
				publicId: imgPublicId
			},
			_id: oldBlog._id
		};

		const updatedBlog = await Blog.findByIdAndUpdate(req.params.blogId, blog, { new: true, runValidators: true }).exec();

		res.json({ success: true, message: 'blog updated', data: updatedBlog });
	})
];

exports.deleteBlog = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		if (!req.user.author) {
			return res.status(401).json({ success: false, message: 'Unauthorized access.' });
		}

		const blogExists = await Blog.findById(req.params.blogId);

		if (!blogExists) {
			return res.status(404).json({ success: false, message: 'Blog not found.' });
		}

		await cloudinary.uploader.destroy(blogExists.img.publicId)
		await Blog.findByIdAndDelete(req.params.blogId);

		res.json({ success: true, message: 'Blog deleted' });
	})
];

exports.getBlog = asyncHandler(async (req, res) => {
	const blog = await Blog.findById(req.params.blogId)
		.populate({
			path: 'comments',
			populate: {
				path: 'creator',
				model: 'User',
				select: 'firstName lastName email profile'
			}
		})
		.populate({
			path: 'creator',
			model: 'User',
			select: 'firstName lastName email profile'
		})
		.populate('topic')
		.exec();

	if (!blog) {
		return res.status(404).json({ success: false, message: 'Blog not found.' });
	}

	res.json({ success: true, message: 'Blog found', data: blog });
});

// Comment endpoints

exports.getBlogComments = asyncHandler(async (req, res) => {
	const blogComments = await Comment.find({ _id: req.params.blogId }).exec();

	res.json({ success: true, message: 'Blog comments', data: blogComments });
});

exports.addCommentToBlog = [
	passport.authenticate('jwt', { session: false }),

	...addCommentValidation,

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ success: false, message: 'Error adding comment', errors: errors.array() });
		}

		const comment = new Comment({
			text: req.body.text,
			creator: req.user
		});

		await comment.save();

		const updatedBlog = await Blog.findByIdAndUpdate(req.params.blogId, { $push: { comments: comment._id } }, { new: true }).exec();

		res.json({ success: true, message: 'Comment added to blog', data: updatedBlog });
	})
];

exports.updateBlogComment = [
	passport.authenticate('jwt', { session: false }),

	...addCommentValidation,

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ success: false, message: 'Error updating comment', errors: errors.array() });
		}

		const comment = {
			text: req.body.text,
			creator: req.user,
			hidden: req.hidden,
			_id: req.params.commentId
		};

		const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, comment, { new: true, runValidators: true }).exec();

		res.json({ success: true, message: 'Blog comment updated', data: updatedComment });
	})
];

exports.deleteBlogComment = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		const comment = await Comment.exists({ _id: req.params.commentId }).populate('creator').exec();

		if (!comment) {
			return res.json({ success: false, message: 'Comment not found' });
		}

		if (req.user._id.toString() !== comment.creator._id.toString()) {
			return res.json({ success: false, message: 'Current user is has no access rights to delete this comment' });
		}

		const result = await Comment.findByIdAndDelete(req.params.commentId);
		await Blog.findByIdAndUpdate(req.params.blogId, { $pull: { comments: req.params.commentId } }, {}).exec();

		res.json({ success: true, message: 'Blog comment deleted', data: result });
	})
];

exports.hideComment = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		if (req.body.hidden === undefined) {
			return res.status(400).json({ success: false, message: 'Undefined value for "hidden" property.' })
		}

		const update = {
			hidden: req.body.hidden
		}

		const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, update, { new: true, runValidators: true }).exec();

		res.json({ success: true, message: 'Blog comment updated', data: updatedComment });
	})
];
