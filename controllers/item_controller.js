exports.getItem = (req,res,next) => {
  res.render('item', {title: req.params.id});
  // res.render('item');
};

exports.createItem = (req,res,next) => {
  res.render('item_form', {title: req.params.id});
  // res.render('item');
};

exports.postCreateItem = (req,res,next) => {
  res.render('item_form', {title: req.params.id});
  // res.render('item');
};


exports.updateItem = (req,res,next) => {
  res.render('item_form', {title: req.params.id});
  // res.render('item');
};

exports.postUpdateItem = (req,res,next) => {
  res.render('item_form', {title: req.params.id});
  // res.render('item');
};

exports.deleteItem = (req,res,next) => {
  res.render('item_deleted', {title: req.params.id});
  // res.render('item');
};