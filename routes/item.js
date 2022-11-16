const express = require('express');
const itemController = require('../controllers/item_controller');
const router = express.Router();

router.get('/',(req,res) => {
  res.redirect('/');
});

router.get('/create',itemController.createItem);
router.post('/create',itemController.postCreateItem);
router.get('/:id',itemController.getItem);
router.get('/:id/update',itemController.updateItem);
router.post('/:id/update',itemController.postUpdateItem);
router.post('/:id/delete',itemController.deleteItem);

module.exports = router;