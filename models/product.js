const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    min: 10,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
