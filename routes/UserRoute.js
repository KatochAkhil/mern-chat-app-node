const express = require("express");
const generateToken = require("../db/config/gereratetoken");
const User = require("../db/models/usermodal");

const router = express.Router();
//signup

router.post("/register", async (req, res) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ msg: "Please Enter the empty Fields" });
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) {
    res.status(400).json({ msg: "Email already exist" });
  }

  const newUser = await User.create(req.body);

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      picture: newUser.picture,
      token: generateToken(newUser._id),
    });
  }
});
// login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ msg: "Please Enter the empty Fields" });
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist && (await userExist.matchPassword(password))) {
    res.status(201).json({
      _id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      picture: userExist.picture,
      token: generateToken(userExist._id),
    });
  }
});

router.get("/", async (req, res) => {
  const search = req.query.search
    ? {
        $or: [
          {
            name: {
              $regex: req.query.search,
            },
          },
          {
            email: {
              $regex: req.query.search,
            },
          },
        ],
      }
    : {};

  const users = await User.find(search);
  res.status(200).json(users);
});

module.exports = router;
