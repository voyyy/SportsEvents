const router = require("express").Router();
const User = require("../models/User");
const isAuth = require("../middlewares/auth");
const { userValidation } = require("../validation");

// @route     Get api/user/users
// @desc      Get users
// @access    Private
router.get("/users", isAuth, async (req, res) => {
  try {
    const users = await User.find();
    if (!users) return res.json({ msg: "Nobody was found" });
    res.json(users);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route     PUT api/user/:id
// @desc      Edit user
// @access    Private
router.put("/:id", isAuth, async (req, res) => {
  const { error } = userValidation(req.body);

  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { name, email, image, description } = req.body;

  const profileField = {};
  if (name) profileField.name = name;
  if (email) profileField.email = email;
  profileField.image = image;
  profileField.updatedDate = Date.now();
  if (description) profileField.description = description;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email is already taken" });

    if (req.user.id !== req.params.id)
      return res.status(401).json({ msg: "Not authorized" });

    user = await User.findByIdAndUpdate(
      req.params.id,

      { $set: profileField },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     Get api/user/:id
// @desc      Get user
// @access    Private
router.get("/:id", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "friends._id",
      model: "user",
    });
    if (!user) return res.status(400).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

// @route     POST api/user/:id/addFriend
// @desc      Send friend request
// @access    Private
router.post("/:id/addFriend", isAuth, async (req, res) => {
  try {
    let receivedUser = await User.findById(req.params.id).select("-image");
    if (!receivedUser) return res.status(404).json({ msg: "User not found" });

    let sendingUser = await User.findById(req.user.id).select("-image");

    let sending = sendingUser.pendingInvitations.sending.some(
      (sendingInvitations) =>
        sendingInvitations._id.toString() === req.params.id
    );
    if (sending)
      return res.status(400).json({ msg: "This user is already invited" });

    let friend = sendingUser.friends.some(
      (friend) => friend._id.toString() === req.params.id
    );
    if (friend)
      return res.status(400).json({ msg: "This user is already your friend" });

    sendingUser.pendingInvitations.sending.push(req.params.id);
    receivedUser.pendingInvitations.received.push(req.user.id);

    sendingUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: sendingUser },
      { new: true }
    ).select("-image");

    receivedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: receivedUser },
      { new: true }
    ).select("-image");

    res.json(sendingUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/user/:id/addFriend
// @desc      Delete friend request
// @access    Private
router.delete("/:id/addFriend", isAuth, async (req, res) => {
  try {
    let receivedUser = await User.findById(req.params.id);
    if (!receivedUser) return res.status(404).json({ msg: "User not found" });

    let sendingUser = await User.findById(req.user.id).select("-image");

    let sending = sendingUser.pendingInvitations.sending.some(
      (sendingInvitations) =>
        sendingInvitations._id.toString() === req.params.id
    );
    if (!sending)
      return res.status(400).json({ msg: "You haven't invited him yet" });

    let friend = sendingUser.friends.some(
      (friend) => friend._id.toString() === req.params.id
    );
    if (friend)
      return res.status(400).json({ msg: "This user is already your friend" });

    const receivedIndex = receivedUser.pendingInvitations.received.findIndex(
      (receivedInvitations) =>
        receivedInvitations._id.toString() === req.params.id
    );

    const sendingIndex = sendingUser.pendingInvitations.sending.findIndex(
      (sendingInvitations) => sendingInvitations._id.toString() === req.user.id
    );

    sendingUser.pendingInvitations.sending.splice(sendingIndex, 1);
    receivedUser.pendingInvitations.received.splice(receivedIndex, 1);

    sendingUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: sendingUser },
      { new: true }
    ).select("-image");

    receivedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: receivedUser },
      { new: true }
    );

    res.json(sendingUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/user/:id/addFriend/accept
// @desc      Accept friend request
// @access    Private
router.post("/:id/addFriend/accept", isAuth, async (req, res) => {
  try {
    let sendingUser = await User.findById(req.params.id);
    if (!sendingUser) return res.status(404).json({ msg: "User not found" });

    let user = await User.findById(req.user.id).select("-image");

    let received = user.pendingInvitations.received.some(
      (receivedInvitations) =>
        receivedInvitations._id.toString() === req.params.id
    );
    if (!received)
      return res.status(400).json({ msg: "You havent this invitation" });

    let friend = user.friends.some(
      (friend) => friend._id.toString() === req.params.id
    );
    if (friend)
      return res.status(400).json({ msg: "This user is already your friend" });

    const receivedIndex = user.pendingInvitations.received.findIndex(
      (receivedInvitations) =>
        receivedInvitations._id.toString() === req.params.id
    );

    const sendingIndex = sendingUser.pendingInvitations.sending.findIndex(
      (userInvitations) => userInvitations._id.toString() === req.user.id
    );

    user.pendingInvitations.received.splice(receivedIndex, 1);
    sendingUser.pendingInvitations.sending.splice(sendingIndex, 1);
    user.friends.push(req.params.id);
    sendingUser.friends.push(req.user.id);

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: user },
      { new: true }
    ).select("-image");

    sendingUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: sendingUser },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/user/:id/addFriend/reject
// @desc      Reject friend request
// @access    Private
router.delete("/:id/addFriend/reject", isAuth, async (req, res) => {
  try {
    let sendingUser = await User.findById(req.params.id);
    if (!sendingUser) return res.status(404).json({ msg: "User not found" });

    let user = await User.findById(req.user.id).select("-image");

    let received = user.pendingInvitations.received.some(
      (receivedInvitations) =>
        receivedInvitations._id.toString() === req.params.id
    );
    if (!received)
      return res.status(400).json({ msg: "You havent this invitation" });

    let friend = user.friends.some(
      (friend) => friend._id.toString() === req.params.id
    );
    if (friend)
      return res.status(400).json({ msg: "This user is already your friend" });

    const receivedIndex = user.pendingInvitations.received.findIndex(
      (receivedInvitations) =>
        receivedInvitations._id.toString() === req.params.id
    );

    const sendingIndex = sendingUser.pendingInvitations.sending.findIndex(
      (userInvitations) => userInvitations._id.toString() === req.user.id
    );

    user.pendingInvitations.received.splice(receivedIndex, 1);
    sendingUser.pendingInvitations.sending.splice(sendingIndex, 1);

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: user },
      { new: true }
    ).select("-image");

    sendingUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: sendingUser },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/user/:id/friend/remove
// @desc      Remove user from friend list
// @access    Private
router.delete("/:id/friend/remove", isAuth, async (req, res) => {
  try {
    let friend = await User.findById(req.params.id);
    if (!friend) return res.status(404).json({ msg: "User not found" });

    let user = await User.findById(req.user.id).select("-image");

    let friends = user.friends.some(
      (friend) => friend._id.toString() === req.params.id
    );
    if (!friends)
      return res.status(400).json({ msg: "This user isn't your friend" });

    const userIndex = user.friends.findIndex(
      (friend) => friend._id.toString() === req.params.id
    );

    const friendIndex = friend.friends.findIndex(
      (friend) => friend._id.toString() === req.user.id
    );

    user.friends.splice(userIndex, 1);
    friend.friends.splice(friendIndex, 1);

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: user },
      { new: true }
    ).select("-image");

    friend = await User.findByIdAndUpdate(
      req.params.id,
      { $set: friend },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/user/:id/rate
// @desc      Rate a user
// @access    Private
router.post("/:id/rate", isAuth, async (req, res) => {
  const { category, rate } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const newRate = {
      _id: req.user.id,
      rate: rate,
    };

    let path = eval(`user.rates.${category}`);

    let rates = path.some((rates) => rates._id.toString() === req.user.id);
    if (rates)
      return res
        .status(400)
        .json({ msg: "User has already a rating from you in this category" });

    path.push(newRate);

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: user },
      { new: true }
    ).select("-image");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     PUT api/user/:id/rate
// @desc      Change a rate
// @access    Private
router.put("/:id/rate", isAuth, async (req, res) => {
  const { category, rate } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const newRate = {
      _id: req.user.id,
      rate: rate,
    };

    let path = eval(`user.rates.${category}`);

    let rates = await path.some(
      (rates) => rates._id.toString() === req.user.id
    );
    //let rates = await path.findById(req.user.id);
    if (!rates)
      return res
        .status(400)
        .json({ msg: "User hasn't a rating from you in this category" });

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { rates: { [category]: newRate } } },
      { new: true }
    ).select("-image");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/user/:id/rate
// @desc      Delete a rate
// @access    Private
router.delete("/:id/rate", isAuth, async (req, res) => {
  const { category } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    let path = eval(`user.rates.${category}`);

    let rates = path.some((rates) => rates._id.toString() === req.user.id);
    if (!rates)
      return res
        .status(400)
        .json({ msg: "User hasn't a rating from you in this category" });

    const index = path.findIndex((rate) => rate._id.toString() === req.user.id);

    path.splice(index, 1);

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: user },
      { new: true }
    ).select("-image");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
