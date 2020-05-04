const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    min: 6,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
    default: null,
  },
  friends: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  pendingInvitations: {
    received: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    sending: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  rates: {
    basketball: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        rate: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    football: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        rate: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    volleyball: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        rate: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
