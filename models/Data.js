const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user-credentials",
    },
    Color: String,
    Head: {
      title: String,
      NavbarName: String,
    },
    HomePage: {
      name: String,
      Position: [String],
      description: String,
    },
    AboutPage: {
      AboutParagraph: String,
      ImageLink: String,
    },
    Skills: [String],
    Projects: [
      {
        title: String,
        ImageLink: String,
        Status: String,
        ProjectName: String,
        Technologies: [String],
        Description: String,
        DemoLink: String,
        
      },
    ],
    Contact: {
      type: Object,
    },
  },
);

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;

// const mongoose = require('mongoose');

// const DataSchema = new mongoose.Schema({
//     user:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user-credentials'
//     },
//     userData:{
//         type: Object,
//         required: true,
//     },
//     date:{
//         type: Date,
//         default: Date.now,
//     }
// })
// module.exports = mongoose.model('userdata', DataSchema);
