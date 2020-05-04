const router = require("express").Router();
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuth = require("../middlewares/auth");

// @route     POST api/auth
// @desc      Register a user
// @access    Public
router.post("/", async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { name, email, password } = req.body;

  try {
    let userName = await User.findOne({ name });

    if (userName) {
      return res.status(400).json({ msg: "Username is already taken" });
    }
    let userEmail = await User.findOne({ email });

    if (userEmail) {
      return res.status(400).json({ msg: "Email is already taken" });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET_TOKEN,
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/auth/login
// @desc      Auth user & get token
// @access    Public
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error) return res.status(400).json({ errors: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json({ msg: "User does not exist" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  console.log(validPassword);
  if (!validPassword)
    return res.status(400).json({ msg: "Password is invalid" });

  const payload = {
    user: {
      id: user.id,
    },
  };
  try {
    jwt.sign(
      payload,
      process.env.SECRET_TOKEN,
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get("/", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate([
        {
          path: "friends._id",
          model: "user",
        },
        {
          path: "pendingInvitations.received._id",
          model: "user",
        },
        {
          path: "pendingInvitations.sending._id",
          model: "user",
        },
      ]);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
