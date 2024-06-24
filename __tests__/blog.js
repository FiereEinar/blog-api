const blogRouter = require('../routes/blog');
const Blog = require('../models/blog');
const Topic = require('../models/topic');
const User = require('../models/user');

const request = require("supertest");
const express = require("express");
const app = express();

require('../utils/mongoConfigTesting').connect();

app.use(express.urlencoded({ extended: false }));
app.use("/blog", blogRouter);

/**
 * MOCK DATABASE DOCUMENTS
 */
// TOPIC
const topic = new Topic({
  title: 'test topic title'
});
topic.save();

// USER/CREATOR
const creator = new User({
  email: 'user@gmail.com',
  firstName: 'john',
  lastName: 'doe',
  password: '123123',
  profile: {
    imgPublicId: 'test',
    imgUrl: 'testtest'
  },
});
creator.save();

// BLOG
const blog = new Blog({
  topic: topic._id,
  creator: creator._id,
  title: 'test title',
  text: 'test text',
  img: {
    publicId: 'test',
    url: 'test'
  }
});
blog.save();



/**
 * TESTS
 */
test('get all the blog', (done) => {
  request(app)
    .get('/blog')
    .expect('Content-Type', /json/)
    .expect(200, done)
})

test('saves a single blog', (done) => {
  const newBlog = new Blog({
    topic: topic._id,
    creator: creator._id,
    title: 'test title',
    text: 'test text',
    img: {
      publicId: 'test',
      url: 'test'
    }
  });
  newBlog.save();

  request(app)
    .get(`/blog/${newBlog._id}`)
    .expect('Content-Type', /json/)
    .expect(200, done)
})

test('gets a single blog', (done) => {
  request(app)
    .get(`/blog/${blog._id}`)
    .expect('Content-Type', /json/)
    .expect(200, done)
})

test('restrict update blog without Authorization', (done) => {
  const formData = {
    title: 'updated text',
    text: 'updated text',
    topicId: topic._id
  };

  request(app)
    .put(`/blog/${blog._id}`)
    .send(formData)
    .expect(401, done)
})
