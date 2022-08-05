const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      //creates relationship between user and Event model. (specific identifier determines by export: mongoose.model("Identifier", schema))
      ref: "Event",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
