const Item = require('../models/item');
const Category = require('../models/category');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const checkPassword = require('../checkPassword');

function handleError(err) {
  console.log(err);
}

exports.getItem = (req,res,next) => {
  Item.findOne({_id:req.params.id})
    .populate('category')
    .then(item => {
      console.log(item);
      res.render('item', {
        title: item.name,
        item: item
      });
    });
  
  // res.render('item');
};

exports.createItem = (req,res,next) => {
  Category
    .find({}, function(err, categories) {
      if (err) return handleError(err);
      const item = {
        name: '',
        description: '',
        location: '',
        category: false,
        price: '',
        img: ''
      };
      res.render('item_form', {
        title: 'Add new house',
        item: item,
        categories: categories,
        post: false,
        update: false,
        fail: false,
      });
    })
};

exports.postCreateItem = (req,res,next) => {
  console.log(req.body);
  const passIsGood = checkPassword(req.body.password);
  if (passIsGood) {
    Item.create(
      { 
        name: req.body.name,
        description: req.body.description,
        category: [req.body.category],
        location: req.body.location,
        price: req.body.price,
        img: req.body.img
      },
      function (err, new_house) {
        if (err) {
          return res.render('item_form', {
            title: 'Error',
            item: req.body,
            post: true,
            update: false,
            fail: err,
            categories: JSON.parse(req.body.categories),
          });
        }

        res.redirect(`/item/${new_house._id}`);
    });
  } else {
    res.render('item_form', {
      title: 'Error',
      item: req.body,
      post: true,
      update: false,
      fail: 'Wrong password',
      categories: JSON.parse(req.body.categories),
    });
  }
};

exports.updateItem = (req,res,next) => {
  Item.findOne({_id: req.params.id}, function (err, item) {
    Category
      .find(
        {},
        function(err, categories) {
          if (err) return handleError(err);
          res.render('item_form', {
            title: false,
            item: item,
            categories: categories,
            update: true,
            post: false
          });
        })

  });

};

exports.postUpdateItem = (req,res,next) => {
  const passIsGood = checkPassword(req.body.password);
  if (passIsGood) {
    Item.findByIdAndUpdate(
      req.body._id,
      {
        name: req.body.name,
        description: req.body.description,
        category: [req.body.category],
        location: req.body.location,
        price: req.body.price,
        img: req.body.img,
      },
      function(err, result) {
        if (err) {
          console.log(err);
          return res.render('item_form', {
            title: false,
            post: true,
            item: req.body,
            update: true,
            categories: JSON.parse(req.body.categories),
            fail: true,
          });
        }
        return res.redirect(`/item/${req.body._id}`);
      }
    );
  } else {
    res.render('item_form', {
      title: false,
      item: req.body,
      post: true,
      update: true,
      categories: JSON.parse(req.body.categories),
      fail: 'wrong password',
    });
  };
};

exports.deleteItem = (req,res,next) => {
  Item
    .findOne({_id: req.params.id}, function(err,result) {
      if (err) {
        return handleError(err);
      }
      res.render('item_delete', {
        title: false,
        post: false,
        body: result,
      });
    })
};

exports.postDeleteItem = (req,res,next) => {
  Item
    .findOne({_id: req.params.id}, function(err,result) {
      if (err) {
        return handleError(err);
      }
      const passIsGood = checkPassword(req.body.password);
      if (passIsGood) {
        Item.findByIdAndDelete(
          req.body._id,
          function (err, result) {
            if (err) return handleError(err);
            res.render('item_delete', {
              title: `Deleted: ${result.name}`,
              post: true,
              body: result,
              fail: false,
            });
          }
        );
      } else {
        res.render('item_delete', {
          title: false,
          post: true,
          body: result,
          fail: 'wrong password',
        });
      }

    })
};
