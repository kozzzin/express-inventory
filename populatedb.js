#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

function categoryCreate(name, cb) {
  var category = new Category({ name: name });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function itemCreate(name, description, location, price, category, img, cb) {
  const itemdetail = { 
    name,
    description,
    location,
    price,
    img
  }

  if (category != false) itemdetail.category = category
    
  var item = new Item(itemdetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}


function createCategories(cb) {
  async.series([
      function(callback) {
        categoryCreate(
          'barn houses',
          callback);
      },
      function(callback) {
        categoryCreate(
          'modern villas',
          callback);
      },
      function(callback) {
        categoryCreate(
          'village homes',
          callback);
      },
      function(callback) {
        categoryCreate(
          'exotic accomodations',
          callback);
      },
      ],
      // optional callback
      cb);
}



function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate(
            'Barn House Deluxe',
            'Description for future',
            'USA',
            '1230004',
            categories[0],
            '/img/barn-1.jpg',
            callback);
        },
        function(callback) {
          itemCreate(
            'Sunset barn',
            'Live in a sunset',
            'USA',
            '400000',
            categories[0],
            '/img/barn-2.jpg',
            callback);
        },
        function(callback) {
          itemCreate(
            'Concrete and tree',
            'Enjoy your own park of one tree',
            'Netherlands',
            '2460000',
            categories[1],
            '/img/modern-1.jpg',
            callback);
        },
        function(callback) {
          itemCreate(
            'Back to school',
            'If you want to open school at home, at least you have enough room for it',
            'Belgium',
            '35600000',
            categories[1],
            '/img/modern-2.jpg',
            callback);
        },
        function(callback) {
          itemCreate(
            'Pool the trigger',
            'Swim until midnight',
            'USA',
            '129000',
            categories[1],
            '/img/modern-3.jpg',
            callback);
        },

        function(callback) {
          itemCreate(
            'Whole Street',
            'If you want good neighbours, buy the whole street and invite your friends',
            'Great Britain',
            '89024600',
            categories[2],
            '/img/village-1.jpg',
            callback);
        },
        function(callback) {
          itemCreate(
            'Cosy Beauty',
            'Nothing special, home for poor princess',
            'Poland',
            '89003',
            categories[2],
            '/img/village-2.jpg',
            callback);
        },
        function(callback) {
          itemCreate(
            'Fairy Tale',
            'Ideal place for fairy tale heroes or scary movie protagonists.',
            'Austria',
            '678456',
            categories[2],
            '/img/village-3.jpg',
            callback);
        },

        function(callback) {
          itemCreate(
            'Beauty and the beast',
            'You don\'t need beautiful house, when your day is only 4 hours',
            'Iceland',
            '126000',
            categories[3],
            '/img/exotic-1.jpg',
            callback);
        },
        function(callback) {
          itemCreate(
            'Hut hut baby',
            'Go into the wild and enjoy your cheap house afterwards',
            'Africa',
            '25000',
            categories[3],
            '/img/exotic-2.jpg',
            callback);
        },
        function(callback) {
          itemCreate(
            'Vivid saturation',
            'If you want to be happier - paint your house brighter',
            'Mexica',
            '98999',
            categories[3],
            '/img/exotic-3.jpg',
            callback);
        },
        ],
        // optional callback
        cb);
}





async.series([
    createCategories,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        // console.log('BOOKInstances: '+bookinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



