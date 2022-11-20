const express = require('express');
const itemController = require('../controllers/item_controller');
const router = express.Router();


// !!! add category name to image 
// check what file is being used

router.get('/',(req,res) => {
  res.redirect('/');
});

router.get('/create',itemController.createItem);
router.get('/create/:id',itemController.postCreateItem);
router.post(
  '/create',
  itemController.postCreateItem
);
router.get('/:id',itemController.getItem);
router.get('/:id/update',itemController.updateItem);
router.post('/:id/update', itemController.postUpdateItem);
router.get('/:id/delete',itemController.deleteItem);
router.post('/:id/delete',itemController.postDeleteItem);

module.exports = router;