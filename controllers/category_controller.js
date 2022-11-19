const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const checkPassword = require('../checkPassword');

exports.getCategories = (req,res,next) => {
  async.parallel(
    {
      categories(callback) {
        Category.find()
        .exec(callback);
      },
      items(callback) {
        Item.aggregate()
        .group({_id:'$category', count: {$sum: 1}})
        .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      const itemsCount = results.items.map((category) => {
        return {_id: category._id[0], count: category.count}
      });

      const categories = results.categories.map(
        (category) => {
          const count = itemsCount.find(cat => cat._id.toString() === category._id.toString());
          return {
            ...category._doc,
            count: !!count ? count.count : 0
          }
        }
      );

      res.render("categories", {
        title: "Categories",
        // items: results.items,
        categories: categories
      });
    }
  );
};

exports.getCategory = (req,res,next) => {
  async.parallel(
    {
      items(callback) {
        Item.find({ 'category': req.params.id })
        .populate("category")
        .exec(callback);
      },
      category(callback) {
        Category.findOne({_id:req.params.id})
        .exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      console.log(results.category);
      console.log(results.items);

      res.render("category", {
        title: "Category",
        items: results.items,
        category: results.category
      });
    }

  )

  // res.render('category', {title: req.params.id});
  // res.render('item');
};

exports.createCategory = (req,res,next) => {
  res.render('category_form', {
    title: 'Add category',
    fail: false,
    body: {},
    post: false,
    update: false,
  });
  // res.render('item');
};



exports.postCreateCategory = (req,res,next) => {
  const passIsGood = checkPassword(req.body.password);
  if (passIsGood) {
    Category.findOne(
      { name: req.body.name.toLowerCase() },
      function(err, found) {
        if (err) return handleError(err);
        if (found === null) {
          Category.create(
            { name: req.body.name.toLowerCase() },
            function (err, new_category) {
              if (err) {
                res.render('category_form', {
                  title: req.params.id,
                  body: req.body,
                  post: true,
                  update: false,
                  fail: err,
                });
              };
              res.render('category_form', {
                title: req.params.id,
                body: req.body,
                post: true,
                update: false,
                fail: false,
              });
            });
          return;
        } else {
          console.log(found);
          return res.redirect(`/category/${found._id}`);
        }
        });
  } else {
    res.render('category_form', {
      title: req.params.id,
      body: req.body,
      post: true,
      update: false,
      fail: 'wrong password',
    });
  };
}


exports.updateCategory = (req,res,next) => {
  Category
    .findOne({_id: req.params.id}, function(err,result) {
      if (err) {
        return handleError(err);
      }
      res.render('category_form', {
        title: false,
        post: false,
        body: result,
        update: true,
      });
    })
};

exports.postUpdateCategory = (req,res,next) => {
  const passIsGood = checkPassword(req.body.password);
  if (passIsGood) {
    Category.findByIdAndUpdate(
      req.body._id,
      {
        name: req.body.name
      },
      function(err, result) {
        if (err) {
          console.log(err);
          return res.render('category_form', {
            title: false,
            post: true,
            body: req.body,
            update: true,
            fail: true,
          });
        }
        return res.redirect(`/category/${req.body._id}`);
      }
    );
  } else {
    res.render('category_form', {
      title: false,
      body: req.body,
      post: true,
      update: true,
      fail: 'wrong password',
    });
  };


  
  // store id somewhere !!
  // res.render('item');
};

exports.deleteCategory = (req,res,next) => {
  Category
    .findOne({_id: req.params.id}, function(err,result) {
      if (err) {
        return handleError(err);
      }
      res.render('category_delete', {
        title: false,
        post: false,
        body: result,
      });
    })
};

exports.postDeleteCategory = (req,res,next) => {
  Category
    .findOne({_id: req.params.id}, function(err,result) {
      if (err) {
        return handleError(err);
      }
      const passIsGood = checkPassword(req.body.password);
      if (passIsGood) {
        Category.findByIdAndDelete(
          req.body._id,
          function (err, result) {
            if (err) return handleError(err);
            res.render('category_delete', {
              title: `Deleted: ${result.name}`,
              post: true,
              body: result,
              fail: false,
            });
          }
        );
      } else {
        res.render('category_delete', {
          title: false,
          post: true,
          body: result,
          fail: 'wrong password',
        });
      }

    })
};

