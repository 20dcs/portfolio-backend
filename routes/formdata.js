const express = require("express");
const router = express.Router();
const Data = require("../models/Data");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// ROUTES-1 : GET ALL NOTES FROM DB GET: "/api/notes/fetchallnotes". LOGIN REQUIRED
router.get("/getdata", fetchuser, async (req, res) => {
  try {
    const formdata = await Data.find(
      { user: req.user.id },
      { _id: 0, user: 0, __v: 0 }
    );

    res.json(formdata);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTES-2 : ADD A NEW NOTE TO DB POST: "/api/notes/addnote". LOGIN REQUIRED
router.post(
  "/adddata",
  fetchuser,
  [body("Color", "Enter a valid color").isLength({ min: 4 })],
  async (req, res) => {
    try {
      const { Color, Head, HomePage, AboutPage, Skills, Projects, Contact } =
        req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const Formdata = new Data({
        Color,
        Head,
        HomePage,
        AboutPage,
        Skills,
        Projects,
        Contact,
        user: req.user.id,
      });
      const savedData = await Formdata.save();

      res.json(savedData);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
// ROUTES-3 : UPDATE AN EXISTING NOTE TO DB PUT: "/api/notes/updatenote". LOGIN REQUIRED
// router.put("/updatenote/:id", fetchuser, async (req, res) => {
//     try {
//         const { title, description, tag } = req.body;
//         const newNote = {};
//         if (title) {
//         newNote.title = title;
//         }
//         if (description) {
//         newNote.description = description;
//         }
//         if (tag) {
//         newNote.tag = tag;
//         }
//         let note = await Note.findById(req.params.id);
//         if (!note) {
//         return res.status(404).send("Not Found");
//         }
//         if (note.user.toString() !== req.user.id) {
//         return res.status(401).send("Not Allowed");
//         }
//         note = await Note.findByIdAndUpdate(
//         req.params.id,
//         { $set: newNote },
//         { new: true }
//         );
//         res.json(note);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }
// });

// ROUTES-4 : DELETE AN EXISTING NOTE TO DB PUT: "/api/notes/deletenote". LOGIN REQUIRED
// router.delete("/deletenote/:id", fetchuser, async (req, res) => {
//     try {
//         let note = await Note.findById(req.params.id);
//         if (!note) {
//         return res.status(404).send("Not Found");
//         }
//         if (note.user.toString() !== req.user.id) {
//         return res.status(401).send("Not Allowed");
//         }
//         note = await Note.findByIdAndDelete(
//         req.params.id
//         );
//         res.json({"Success": "Note Successfully Deleted", note:note});
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }
// });
