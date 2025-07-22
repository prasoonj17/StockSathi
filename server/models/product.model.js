

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  tenantId: {
//  type: mongoose.Schema.Types.ObjectId,
  type: String,
//  ref: 'Tenant',
  required: true
},
  productName: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  brand: { type: String },
  unitType: { type: String, 
       enum: ['pcs', 'kg', 'litre', 'box'],
   
    required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  minStockAlert: { type: Number, default: 0 },
  sku: { type: String, required: true, unique: true }, // ✅ Required
  barcode: { type: String }, // ✅ Path or URL
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
