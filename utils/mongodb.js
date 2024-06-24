const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.DATABASE_URI;

connectToMongoDB().catch((err) => console.log(err));

async function connectToMongoDB() {
  await mongoose.connect(mongoDB);
}
