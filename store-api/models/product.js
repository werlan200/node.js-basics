const moongose = require("mongoose");

const productSchema = new moongose.Schema({
  name: {
    type: String,
    require: [true, "name must be given"],
  },
  price: {
    type: Number,
    require: [true, "price must be given"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported",
    },
  },
});

module.exports = moongose.model("Product", productSchema);
