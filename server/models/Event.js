const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  category: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  maxPlayers: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  interested: [
    {
      interestedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  signed: [
    {
      signedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("event", EventSchema);
