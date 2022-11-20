const Item = require('../models/item');
const Category = require('../models/category');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const checkPassword = require('../checkPassword');

const path = require('path');

const multer  = require('multer');
const { MulterError } = require('multer');
const { INSPECT_MAX_BYTES } = require('buffer');
const { update } = require('../models/category');
const { redirect } = require('express/lib/response');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img')
  },
  filename: function (req, file, cb) {
    console.log(req.body);
    const name = 
     'img-' + Date.now() + 
        path.extname(file.originalname);
    console.log(name);
    return cb(null, name);
  }
})

// const upload = multer({ storage: storage })

const upload = multer(
  { 
    // dest: 'public/img',
    fileFilter: function fileFilter (req, file, cb) {    
      // Allowed ext

      const filetypes = /jpeg|jpg|png|gif/;
    
      // Check ext
      const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
      // Check mime
      const mimetype = filetypes.test(file.mimetype);
    
      if(mimetype && extname){
        return cb(null,true);
      } else {
        req.fileValidationError = "Forbidden extension";
        return cb(null, false, req.fileValidationError);
      }
    },
    storage: storage
  }).single('file');




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
    // RENAMING FILES using originally extension
    // Updating items. Current Photo: if you want new, upload File. Check the file field before update.
  

    upload(req, res, function(err) {
      if (req.fileValidationError) {
        return res.render('item_form', {
          title: 'Error',
          item: req.body,
          post: true,
          update: false,
          fail: 'wrong file format!',
          categories: JSON.parse(req.body.categories),
        });
      }

      const passIsGood = checkPassword(req.body.password);
      if (passIsGood) {
        Item.create(
          { 
            name: req.body.name,
            description: req.body.description,
            category: [req.body.category],
            location: req.body.location,
            price: req.body.price,
            img: req.file.path.match(/(\/img\/.*)/gm)[0],
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
      // Everything went fine.
    });

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
  upload(req, res, function(err) {
    if (req.fileValidationError) {
      return res.render('item_form', {
        title: 'Error',
        item: req.body,
        post: true,
        update: true,
        fail: req.fileValidationError,
        categories: JSON.parse(req.body.categories),
      });
    };

    const img = !!req.file ?
      req.file.path.match(/(\/img\/.*)/gm)[0] :
        req.body.img; 
 
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
          img: img,
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

  });








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
