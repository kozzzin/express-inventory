// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name:  {
      type: String,
      min: [3, "Min 3 symbols"],
      required: [true, "You need the name for category"],
      // unique: true
    }
  });


// Or by using the virtual method as following:  
CategorySchema.virtual('url').get(function() {
  return `/category/${this._id}`;
});

const Category = mongoose.model("Category", CategorySchema);


module.exports = Category;

// db.collection.update(doc, doc, {upsert:true}) to find check and insert if not found