import React, { use, useState } from 'react';
import { PlusCircleIcon, CheckCircleIcon,ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/solid';
import {  Loader2 } from "lucide-react"; // loader icon
import { toast } from 'react-toastify';
import { useMemo } from 'react';
//import PlusCircleIcon from '@heroicons/react/24/solid';

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
      toast(" ✅ product added successfully");
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
  <div className="fixed inset-0 overflow-y-auto bg-gray-50 animate-fade-in md:left-[250px]">
    {/* Main Container - Mobile First Approach */}
    <div className="w-full  min-h-screen p-4 md:p-6 mx-auto  ">
      {/* Card with better mobile spacing */}
      <div className="w-full bg-white rounded-xl shadow-lg p-4 md:p-8 border border-gray-200 transition-all duration-300 hover:shadow-md">
        
        {/* Header Section - Responsive */}
        <div className="mb-6 pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow w-fit">
              <PlusCircleIcon className="w-6 h-6 text-white md:w-7 md:h-7" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                  Add New Product
                </span>
              </h2>
              <p className="text-sm md:text-base text-gray-500 mt-1">
                Fill in the product details below
              </p>
            </div>
          </div>
        </div>

        {/* Form Grid - Responsive Columns */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
          {/* Dynamic Form Fields (Optimized for Mobile) */}
          {[
            {
              label: "Product Name",
              name: "productName",
              type: "text",
              placeholder: "e.g., Parle-G Biscuit",
              required: true
            },
            {
              label: "Category",
              name: "category",
              type: "select",
              options: categories,
              required: true
            },
            {
              label: "Subcategory (Optional)",
              name: "subcategory",
              type: "text",
              placeholder: "e.g., Cotton"
            },
            {
              label: "Brand (Optional)",
              name: "brand",
              type: "text",
              placeholder: "e.g., Levi's"
            },
            {
              label: "Unit Type",
              name: "unitType",
              type: "select",
              options: unitTypes,
              required: true
            },
            {
              label: "Initial Stock",
              name: "quantity",
              type: "number",
              placeholder: "e.g., 100",
              min: "0",
              required: true
            },
            {
              label: "Purchase Price (per unit)",
              name: "purchasePrice",
              type: "number",
              placeholder: "e.g., 50",
              min: "0",
              step: "0.01",
              required: true
            },
            {
              label: "Selling Price (MRP per unit)",
              name: "sellingPrice",
              type: "number",
              placeholder: "e.g., 60",
              min: "0",
              step: "0.01",
              required: true
            },
            {
              label: "Discount % (Optional)",
              name: "discount",
              type: "number",
              placeholder: "e.g., 10",
              min: "0",
              max: "100",
              step: "0.1"
            },
            {
              label: "Min Stock Alert",
              name: "minStockAlert",
              type: "number",
              placeholder: "e.g., 10",
              min: "0",
              required: true
            },
            {
              label: "Variant (Optional)",
              name: "variant",
              type: "text",
              placeholder: "e.g., Large"
            },
            {
              label: "SKU Code",
              name: "sku",
              type: "text",
              placeholder: "Auto-generated",
              required: true
            }
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm md:text-base text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 text-sm md:text-base text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                />
              )}
            </div>
          ))}

          {/* Submit Button - Centered & Responsive */}
          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-64 mx-auto px-6 py-3 rounded-xl font-medium text-white shadow-md transition-all duration-300 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <svg className="w-4 h-4 md:w-5 md:h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className='text-blue ' >Processing...</span>
                  </>
                ) : (
                  <>
                    <PlusCircleIcon className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Add Product</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>

        {/* Responsive Success/Error Messages */}
        {successMessage && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in-up">
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
                {barcode && (
                  <div className="mt-2 flex">
                    <button
                      onClick={handlePrintBarcode}
                      className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                      <PrinterIcon className="-ml-0.5 text-blue  mr-1.5 h-3.5 w-3.5" />
                      Print Barcode
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in-up">
            <div className="flex items-start">
              <ExclamationCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

  );
};

export default AddProduct;