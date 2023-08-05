const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  content: { type: String, required: true },
});

module.exports = mongoose.model("SubSection", subSectionSchema);
