const userRouter = require('../routes/user');
const User = require('../models/user');

const request = require("supertest");
const express = require("express");
const app = express();

require('../utils/mongoConfigTesting').connect();

app.use(express.urlencoded({ extended: false }));
app.use("/user", userRouter);

test('handles IDs', (done) => {
  const user = new User({
    email: 'user@gmail.com',
    firstName: 'john',
    lastName: 'doe',
    password: '123123',
    profile: {
      imgPublicId: 'test',
      imgUrl: 'testtest'
    },
  });

  user.save();

  request(app)
    .get(`/user/${user._id}`)
    .expect('Content-Type', /json/)
    .expect(200, done)
})

test('handles non-existent IDs', (done) => {
  request(app)
    .get(`/user/6678b70298cf17df7c41a483`)
    .expect(404, done)
})
