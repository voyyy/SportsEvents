const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/auth");
const { eventValidation } = require("../validation");
const moment = require("moment");

const User = require("../models/User");
const Event = require("../models/Event");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// @route     GET api/event
// @desc      Get all users events
// @access    Private
router.get("/", isAuth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/event
// @desc      Add new event
// @access    Private
router.post("/", isAuth, async (req, res) => {
  const { error } = eventValidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const {
    category,
    startDate,
    endDate,
    city,
    street,
    maxPlayers,
    description,
  } = req.body;
  try {
    const newEvent = new Event({
      category,
      startDate,
      endDate,
      city,
      street,
      maxPlayers,
      description,
      user: req.user.id,
    });

    newEvent.signed.push(req.user.id);
    const event = await newEvent.save();

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     PUT api/event/:id
// @desc      Update event
// @access    Private
router.put("/:id", isAuth, async (req, res) => {
  const { error } = eventValidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const {
    category,
    startDate,
    endDate,
    city,
    street,
    maxPlayers,
    description,
  } = req.body;

  const eventFields = {};
  if (category) eventFields.category = category;
  if (startDate) eventFields.startDate = startDate;
  if (endDate) eventFields.endDate = endDate;
  if (city) eventFields.city = city;
  if (street) eventFields.street = street;
  if (maxPlayers) eventFields.maxPlayers = maxPlayers;
  if (description) eventFields.description = description;
  eventFields.updatedDate = Date.now();

  try {
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "event not found" });

    // Make sure user owns contact
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: eventFields },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     Get api/event/single/:id
// @desc      Get event
// @access    Public
router.get("/single/:id", async (req, res) => {
  try {
    let event = await Event.findById(req.params.id).populate([
      {
        path: "signed._id",
        model: "user",
      },
      {
        path: "interested._id",
        model: "user",
      },
    ]);

    if (!event) return res.status(404).json({ msg: "event not found" });

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/event/:id
// @desc      Delete event
// @access    Private
router.delete("/:id", isAuth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found" });

    // Make sure user created event
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Event.findByIdAndRemove(req.params.id);

    res.json({ msg: "Event removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     GET api/event/all
// @desc      Display all events
// @access    Public
router.get("/all", async (req, res) => {
  try {
    const events = await Event.find({});
    if (!events) return res.status(404).json({ msg: "Events not found" });

    res.json(events);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route     GET api/event/upcoming
// @desc      Display all upcoming events
// @access    Public
router.get("/upcoming", async (req, res) => {
  try {
    const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
    const events = await Event.find({ startDate: { $gt: currentDate } }).sort({
      startDate: 1,
    });
    if (!events) return res.status(404).json({ msg: "Events not found" });

    res.json(events);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route     GET api/event/ongoing
// @desc      Display all user ongoing events
// @access    Private
router.get("/ongoing", isAuth, async (req, res) => {
  try {
    const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
    const events = await Event.find({
      "signed._id": req.user.id,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).sort({
      startDate: 1,
    });
    if (!events) return res.status(404).json({ msg: "Events not found" });

    res.json(events);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route     GET api/event/finished
// @desc      Display all user finished events
// @access    Private
router.get("/finished", isAuth, async (req, res) => {
  try {
    const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
    const events = await Event.find({
      "signed._id": req.user.id,
      endDate: { $lt: currentDate },
    }).sort({
      startDate: 1,
    });
    if (!events) return res.status(404).json({ msg: "Events not found" });

    res.json(events);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route     GET api/event/finished/:id
// @desc      Display all user finished events
// @access    Private
router.get("/finished/:id", isAuth, async (req, res) => {
  try {
    const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
    const events = await Event.find({
      "signed._id": req.params.id,
      endDate: { $lt: currentDate },
    }).sort({
      startDate: 1,
    });
    if (!events) return res.status(404).json({ msg: "Events not found" });

    res.json(events);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route     Put api/event/:id/interested
// @desc      User interested in event
// @access    Private
router.put("/:id/interested", isAuth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found" });

    let interested = event.interested.some(
      (interestedPerson) => interestedPerson._id.toString() === req.user.id
    );
    if (interested)
      return res.status(400).json({ msg: "User already interested in event" });

    let signed = event.signed.some(
      (signedPerson) => signedPerson._id.toString() === req.user.id
    );
    if (signed)
      return res.status(400).json({ msg: "User already signed in event" });

    event.interested.push(req.user.id);

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: event },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error interested");
  }
});

// @route     Put api/event/:id/signed
// @desc      User signed in event
// @access    Private
router.put("/:id/signed", isAuth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found" });

    let interested = event.interested.some(
      (interestedPerson) => interestedPerson._id.toString() === req.user.id
    );

    if (interested) {
      const index = event.interested.findIndex(
        (interestedPerson) => interestedPerson._id.toString() === req.user.id
      );
      event.interested.splice(index, 1);
    }

    let signed = event.signed.some(
      (signedPerson) => signedPerson._id.toString() === req.user.id
    );
    if (signed)
      return res.status(400).json({ msg: "User already signed in event" });

    event.signed.push(req.user.id);

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: event },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     Put api/event/:id/uninterested
// @desc      User uninterested in event
// @access    Private
router.put("/:id/uninterested", isAuth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    let signed = event.signed.some(
      (signedPerson) => signedPerson._id.toString() === req.user.id
    );
    if (signed) return res.status(400).json({ msg: "User is signed in event" });

    let interested = event.interested.some(
      (interestedPerson) => interestedPerson._id.toString() === req.user.id
    );
    if (!interested)
      return res.status(400).json({ msg: "User is not interested in event" });

    const index = event.interested.findIndex(
      (interestedPerson) => interestedPerson._id.toString() === req.user.id
    );
    event.interested.splice(index, 1);

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: event },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error interested");
  }
});

// @route     Put api/event/:id/unsigned
// @desc      User unsigned in event
// @access    Private
router.put("/:id/unsigned", isAuth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found" });

    let interested = event.interested.some(
      (interestedPerson) => interestedPerson._id.toString() === req.user.id
    );
    if (interested)
      return res.status(400).json({ msg: "User is interested in event" });

    let signed = event.signed.some(
      (signedPerson) => signedPerson._id.toString() === req.user.id
    );
    if (!signed)
      return res.status(400).json({ msg: "User is not signed in event" });

    const index = event.signed.findIndex(
      (signedPerson) => signedPerson._id.toString() === req.user.id
    );
    event.signed.splice(index, 1);

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: event },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
