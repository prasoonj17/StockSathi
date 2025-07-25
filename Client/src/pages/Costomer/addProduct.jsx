import React, { use, useState } from 'react';
import { PlusCircleIcon, ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/solid';
import {  Loader2 } from "lucide-react"; // loader icon
import { toast } from 'react-toastify';
import { useMemo } from 'react';

const AddProduct = () => {

  
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    subcategory: '',
    brand: '',
    unitType: '',
    quantity: '',
    purchasePrice: '',
    sellingPrice: '',
    discount: '',
    minStockAlert: '',
    variant: '',
    sku: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [productId, setProductId] = useState(null);
  const [barcode, setBarcode] = useState('');
  const[loading,setLoading]=useState(false);

  // Predefined options for dropdowns
  const categories = ['Kirana', 'Garments', 'General', 'Electronics'];
  const unitTypes = ['pcs', 'kg', 'litre', 'box'];




  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate SKU if productName, brand, or variant changes
    if (name === 'productName' || name === 'brand' || name === 'variant') {
      const skuBase = [
        name === 'productName' ? value : formData.productName,
        name === 'brand' ? value : formData.brand,
        name === 'variant' ? value : formData.variant
      ]
        .filter(Boolean)
        .join('-')
        .toUpperCase()
        .replace(/\s+/g, '');
      setFormData((prev) => ({ ...prev, sku: skuBase || prev.sku }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
   
    e.preventDefault();
     setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    let response;
    let responseText = '';
    try {
      const token = localStorage.getItem('token'); // Assuming auth token is stored
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'; // Vite env variable
      response = await fetch(`${baseUrl}/api/product/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        responseText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${responseText}`);
      }

      const data = await response.json();
      //console.log('Received barcode data:', data.product.barcode); // Debug barcode
      setSuccessMessage(data.message);
      setProductId(data.product._id);
      setBarcode(data.product.barcode); // Expecting Cloudinary URL
      setFormData({
        productName: '',
        category: '',
        subcategory: '',
        brand: '',
        unitType: '',
        quantity: '',
        purchasePrice: '',
        sellingPrice: '',
        discount: '',
        minStockAlert: '',
        variant: '',
        sku: ''
      });
      toast("product added successfully");
      setLoading(false);
    } catch (err) {
      let errorMsg = `Error adding product: ${err.message}. `;
      if (err.message.includes('404')) {
        errorMsg += 'Endpoint /api/product/add not found. Check backend routes.';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMsg += 'Server might be down. Ensure backend is running on ' + (import.meta.env.VITE_BASE_URL || 'http://localhost:5000') + '.';
      } else if (barcode && !barcode.startsWith('http')) {
        errorMsg += 'Barcode data is invalid. Expecting a valid URL. Check backend response.';
      }
      setErrorMessage(errorMsg);
     
    }
  };

  // Handle print barcode
  const handlePrintBarcode = () => {
    if (!barcode) {
      alert('No barcode available to print!');
      return;
    }
    console.log('Printing barcode with URL:', barcode); // Debug URL
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body { text-align: center; padding: 20px; }
            img { max-width: 100%; height: auto; border: 1px solid #1e40af; }
          </style>
        </head>
        <body> 
          <h2 style="color: #1e40af;">${formData.productName || 'Product'} Barcode</h2>
          <p style="font-size: 16px;">SKU: ${formData.sku}</p>
          <img src="${barcode}" alt="Barcode" style="width: 250px;" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };



  return (

    <div className="fixed top-0 left-[250px] w-[calc(100%-250px)] h-screen overflow-y-auto bg-white p-6 animate-fade-in">
      <div className="w-full h-full bg-white rounded-lg shadow-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center animate-pulse-once">
          <PlusCircleIcon className="w-8 h-8 mr-2 text-blue-600" />
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {/* Product Name */}
          <div>
            <label className="block text-blue-700 font-semibold">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="e.g., Parle-G Biscuit"
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-blue-700 font-semibold">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-blue-700 font-semibold">Subcategory (Optional)</label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              placeholder="e.g., Cotton"
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-blue-700 font-semibold">Brand (Optional)</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., Levi's"
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Unit Type */}
          <div>
            <label className="block text-blue-700 font-semibold">Unit Type</label>
            <select
              name="unitType"
              value={formData.unitType}
              onChange={handleChange}
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Unit Type</option>
              {unitTypes.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-blue-700 font-semibold">Initial Stock Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 100"
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min="0"
            />
          </div>

          {/* Purchase Price */}
          <div>
            <label className="block text-blue-700 font-semibold">Purchase Price</label>
            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="e.g., 50"
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Selling Price */}
          <div>
            <label className="block text-blue-700 font-semibold">Selling Price (MRP)</label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              placeholder="e.g., 60"
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-blue-700 font-semibold">Discount % (Optional)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="e.g., 10"
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          {/* Min Stock Alert */}
          <div>
            <label className="block text-blue-700 font-semibold">Min Stock Alert</label>
            <input
              type="number"
              name="minStockAlert"
              value={formData.minStockAlert}
              onChange={handleChange}
              placeholder="e.g., 10"
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min="0"
            />
          </div>

          {/* Variant */}
          <div>
            <label className="block text-blue-700 font-semibold">Variant (Optional)</label>
            <input
              type="text"
              name="variant"
              value={formData.variant}
              onChange={handleChange}
              placeholder="e.g., Large"
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-blue-700 font-semibold">SKU Code</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Auto-generated or edit"
              className="w-full text-gray-500 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Submit Button */}
     

              <div className="lg:col-span-2">
      <button
        type="submit"
        //onClick={handleSubmit}
        disabled={loading}
        className="w-64 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <PlusCircleIcon className="w-5 h-5" />
            Add Product
          </>
        )}
      </button>
    </div>

        </form>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-lg flex items-center animate-slide-up">
            <span>{successMessage}</span>
            {barcode && (
              <button
                onClick={handlePrintBarcode}
                className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center animate-pulse"
              >
                <PrinterIcon className="w-5 h-5 mr-2 text-black" />
                Print Barcode
              </button>
            )}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg animate-slide-up">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;