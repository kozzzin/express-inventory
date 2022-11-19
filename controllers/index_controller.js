const Item = require('../models/item');
const Category = require('../models/category');
const async = require('async');

exports.getContent = (req,res) => {


  async.parallel(
    {
      items(callback) {
        Item.find()
          .populate("category")
          .exec(callback);
      },
      categories(callback) {
        Category.find()
        .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      console.log(results.categories);
      console.log(results.items);

      res.render("index", {
        title: "Welcome and buy",
        items: results.items,
        categories: results.categories
      });
    }
  );
};