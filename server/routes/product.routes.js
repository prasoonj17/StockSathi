const express = require('express');
const router = express.Router();
const { addProduct,getAllProducts,hardDeleteProduct ,getProductById,updateProduct} = require('../controllers/product.controller');
const auth = require('../middlewares/authMiddleware');
const tenant = require('../middlewares/tenantMiddleware');


router.post('/add', auth, tenant, addProduct);       //add 
router.get('/all', auth, tenant, getAllProducts);      // get al product
router.get('/:id', auth, tenant, getProductById);   //get particular  product detail
router.put('/update/:id', auth, tenant, updateProduct);
router.delete('/delete/:id', auth, tenant, hardDeleteProduct); //delete

module.exports = router;
