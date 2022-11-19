const express = require('express');
const router = express.Router();
// const Category = require('../models/category');
const categoryController = require('../controllers/category_controller');

// get

// get form

// post form

// get update 

// post update

// get delete

// post delete

router.get('/',(req,res) => {
  res.redirect('category/all');
});

router.get('/create',categoryController.createCategory);
router.post('/create',categoryController.postCreateCategory);
router.get('/all',categoryController.getCategories);
router.get('/:id',categoryController.getCategory);
router.get('/:id/update',categoryController.updateCategory);
router.post('/:id/update',categoryController.postUpdateCategory);
router.get('/:id/delete',categoryController.deleteCategory);
router.post('/:id/delete',categoryController.postDeleteCategory);


module.exports = router;