// Require Mongoose
const mongoose = require("mongoose");
// Define a schema
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
      type: String,
      min: [3, "Min 3 symbols"],
      required: [true, "You need the name for product"],
      // unique: true
    },
  description: String,
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  location: String,
  price: Number,
  img: String
});


// Or by using the virtual method as following:  
ItemSchema.virtual('url').get(function() {
  return `/item/${this._id}`;
});

const Item = mongoose.model("Item", ItemSchema);


module.exports = Item;
