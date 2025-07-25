import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const EditProduct = ({ product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });

  useEffect(() => {
    setEditedProduct({ ...product });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!editedProduct.productName || !editedProduct.quantity) {
      toast('Product Name and Quantity are required.');
      return;
    }
    onSave(editedProduct);
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg border border-blue-100">
        <h3 className="text-xl font-bold text-blue-600 mb-4">Edit Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              name="productName"
              value={editedProduct.productName || ''}
              onChange={handleChange}
              placeholder="Enter Product Name"
              className="w-full text-black p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={editedProduct.category || ''}
              onChange={handleChange}
              placeholder="Enter Category"
              className="w-full text-black p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
            <input
              type="text"
              name="unitType"
              value={editedProduct.unitType || ''}
              onChange={handleChange}
              placeholder="Enter Unit Type"
              className="w-full text-black p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={editedProduct.quantity || ''}
              onChange={handleChange}
              placeholder="Enter Quantity"
              className="w-full text-black p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
            <input
              type="number"
              name="purchasePrice"
              value={editedProduct.purchasePrice || ''}
              onChange={handleChange}
              placeholder="Enter Purchase Price"
              className="w-full text-black p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
            <input
              type="number"
              name="sellingPrice"
              value={editedProduct.sellingPrice || ''}
              onChange={handleChange}
              placeholder="Enter Selling Price"
              className="w-full text-black p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={editedProduct.sku || ''}
              onChange={handleChange}
              placeholder="Enter SKU"
              className="w-full text-black p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barcode URL</label>
            <input
              type="text"
              name="barcode"
              value={editedProduct.barcode || ''}
              onChange={handleChange}
              placeholder="Enter Barcode URL"
              className="w-full text-black p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Alert</label>
            <input
              type="number"
              name="minStockAlert"
              value={editedProduct.minStockAlert || ''}
              onChange={handleChange}
              placeholder="Enter Min Stock Alert"
              className="w-full text-black p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
            <input
              type="text"
              name="subcategory"
              value={editedProduct.subcategory || ''}
              onChange={handleChange}
              placeholder="Enter Subcategory"
              className="w-full text-black p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={editedProduct.brand || ''}
              onChange={handleChange}
              placeholder="Enter Brand"
              className="w-full text-black p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
         
          <button
            onClick={handleSave}
            className="px-4 py-2  bg-gradient-to-r from-green-500 to-green-700 text-black font-semibold rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Save
          </button>

           <button
            onClick={onClose}
           className="px-4 py-2  bg-gradient-to-r from-red-500 to-red-700  text-black font-semibold rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default EditProduct;