const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = process.env.JWT_SECRET_TOKEN;

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
    body("username")
      .matches(/^[a-z0-9]+$/, "i")
      .withMessage("Username must contain only alphanumeric characters")
      .custom(value => {
        if (value.match(/[./_=]/)) {
          throw new Error('Username must not contain ./_= symbols');
        }
        return true;
      })
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,  errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      let username = await User.findOne({ username: req.body.username });
      if (user) {
        return res
          .status(400)
          .json({success, error: "Sorry a user with this email already exists" });
      }
      if(username){
        return res.status(400).json({success, error: "Sorry a user with this username already exists"});
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: { id: user.id },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

// Authenticate a user using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be empty").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Your entered email is not registered" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "You have entered wrong password" });
          success = false;
      }
      const data = {
        user: { id: user.id },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.send({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Get loggedin User details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser ,async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getallusers", async (req, res) => {
  try {
    // Ensure the user making the request is an admin or has the necessary permissions
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    // Fetch all users' names and emails (excluding the password field)
    const users = await User.find({}).select("-password");
    // res.render('userlist', { users });
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
