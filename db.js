const mongoose = require("mongoose");
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;

const connectToMongo = () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = connectToMongo;
