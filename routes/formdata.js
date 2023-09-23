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

// ROUTES-3 : GET DATA OF ALL FROM MONGODB: "/api/userdata/getalljson". LOGIN REQUIRED
router.get("/getalljson", async (req, res) => {
  try {
    const formdata = await Data.find(
      {},
      { __v: 0 }
    );
    res.json(formdata);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTES-4 : GET A NOTE OF PERTICULAR ID: "/api/userdata/getalljson/:id". LOGIN REQUIRED
router.get("/getalljson/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const formdata = await Data.find(
      { user: userId },
      { _id: 1, user: 0, __v: 0 }
    );
    res.json(formdata);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
