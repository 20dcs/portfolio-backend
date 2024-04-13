const mongoose = require("mongoose");
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;
const User = require("./models/User");
const connectToMongo = () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
    // addDefaultUsernames();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
async function addDefaultUsernames() {
  try {
    // Find all users without a username
    const usersWithoutUsername = await User.find({ username: { $exists: false } });

    // Update each user with a default username
    for (const user of usersWithoutUsername) {
      user.username = generateDefaultUsername(user.email); // You can generate username based on email or any other data
      await user.save();
      console.log(`Added username ${user.username} for user ${user._id}`);
    }

    console.log('All users updated with default usernames');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding default usernames:', error);
    mongoose.connection.close();
  }
}

// Function to generate a default username based on email
function generateDefaultUsername(email) {
  // For simplicity, you can just use a part of the email as the username
  const username = email.split('@')[0];
  return username;
}
module.exports = connectToMongo;


// mongodb+srv://naitikpatel2002:Naitik%40123@cluster0.fhqhuwl.mongodb.net/profolio?retryWrites=true&w=majority