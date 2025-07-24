// controllers/productController.js

const Product = require('../models/product.model');
const generateSKU = require('../utils/skuGenerator');
const generateBarcode = require('../utils/generateBarcode');

//add product

exports.addProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      subcategory,
      brand,
      unitType,
      quantity,
      purchasePrice,
      sellingPrice,
      discount,
      minStockAlert,
      variant,
      
    } = req.body;

    // ✅ Get tenantId from middleware
    const tenantId = req.tenantId;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID is missing' });

    // 💥 Generate a unique SKU for this product
    const sku = generateSKU({ productName, brand, variant });

    // 🛑 Check if product with same SKU already exists for this tenant
    const existingProduct = await Product.findOne({ sku, tenantId });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with same SKU already exists' });
    }

    const barcodePath = await generateBarcode(sku); // <-- move here
    // ✅ Create new product
    const newProduct = new Product({
      tenantId,
      productName,
      category,
      subcategory,
      brand,
      unitType,
      quantity,
      purchasePrice,
      sellingPrice,
      discount,
      minStockAlert,
      variant,
      sku,
      barcode: barcodePath, // new field
    });
    await newProduct.save();

    return res.status(201).json({
      message: 'Product added successfully',
      product: newProduct,
    });
  } catch (err) {
    console.error('❌ Add Product Error:', err);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};





//to get all products..

exports.getAllProducts = async (req, res) => {
  try {
const tenantId = req.tenantId;
    //console.log(tenantId);
        console.log('🔥 Tenant ID:', tenantId); // 👈 Add this line


    // Filters & Query Params
    const {
      search = '',
      category,
      status,
      unit,
      sortBy = 'createdAt', // or 'name'
      sortOrder = 'desc',    // 'asc' or 'desc'
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      tenantId,
    //  isDeleted: false, //in future if i want to do softdelete just delete from screen not from db
    };
console.log("🔍 Tenant ID being used:", req.tenantId);
console.log("🔍 Full Query:", query);
    // Search logic
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) query.category = category;
    if (status) query.status = status;
    if (unit) query.unit = unit;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting logic
    const sortQuery = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const totalProducts = await Product.countDocuments(query);
    //console.log(totalProducts);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));


      
    const productsWithStockStatus = products.map(product => {
  let stockStatus = 'average';

  if (product.quantity <= product.minStockAlert) {
    stockStatus = 'low';
  } else if (product.quantity > product.minStockAlert * 3) {
    stockStatus = 'high';
  }

  return {
    ...product.toObject(), // convert mongoose doc to plain object
    stockStatus,
  };
});
console.log(productsWithStockStatus);



    //  console.log(products);
    res.status(200).json({
      success: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products: productsWithStockStatus

    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


//get product by id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const product = await Product.findOne({
      _id: id,
      tenantId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


//to update the user


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;
    const updatedData = req.body;

    //  Secure query: only allow tenant to update their own product
    const product = await Product.findOneAndUpdate(
      { _id: id, tenantId },
      updatedData,
      { new: true } // returns the updated document
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized access',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while updating the product',
    });
  }
};



//to delete product
exports.hardDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req;

    const deleted = await Product.findOneAndDelete({ _id: id, tenantId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product permanently deleted" });
  } catch (err) {
    console.error("Hard delete error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
