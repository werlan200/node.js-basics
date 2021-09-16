const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "provide company"],
      maxLength: 40,
    },
    position: {
      type: String,
      required: [true, "provide position"],
      maxLength: 70,
    },
    status: {
      type: String,
      enum: ["pending", "declined", "interview"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
