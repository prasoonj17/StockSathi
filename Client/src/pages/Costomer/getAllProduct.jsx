import React, { useState, useEffect } from 'react';
import { PlusCircleIcon, ExclamationTriangleIcon, PencilIcon } from '@heroicons/react/24/solid';
import EditProduct from './EditProduct'; // Adjust path as per your project structure
import { TrashIcon } from "@heroicons/react/24/solid";
import { PrinterIcon } from '@heroicons/react/24/solid';
import { EyeIcon } from '@heroicons/react/16/solid';
import confirmDeletePopup from '../../utils/confirmdeletepopup';
import ProductDetailsModal from './ProductDetailsModal';

const GetAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
   const [open, setOpen] = useState(false);
  //const [selectedProduct, setSelectedProduct] = useState(null);
 const[viewopen,setViewopen]=useState(false);
 const[selectview,setSelectview]=useState(null);

   // Add this state to your component
const [printBarcodeData, setPrintBarcodeData] = useState(null);


//it is used to print the barcode

const handlePrintBarcode = (product) => {
  if (!product.barcode) {
    toast.warning('This product has no barcode');
    return;
  }
  setPrintBarcodeData(product);
};

// Add this print function
const printBarcode = () => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Barcode - ${printBarcodeData.productName}</title>
        <style>
          @page { size: auto; margin: 5mm; }
          body { 
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
          }
          .barcode-container {
            text-align: center;
            padding: 20px;
            border: 1px solid #eee;
            max-width: 300px;
            margin: 0 auto;
          }
          .product-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .barcode-image {
            max-width: 100%;
            height: auto;
            margin: 15px 0;
            image-rendering: crisp-edges;
          }
          .product-info {
            font-size: 14px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="barcode-container">
          <div class="product-name">${printBarcodeData.productName}</div>
          <img src="${printBarcodeData.barcode}" class="barcode-image" />
          <div class="product-info">
            <div>SKU: ${printBarcodeData.sku}</div>
            <div>Price: ₹${printBarcodeData.sellingPrice?.toFixed(2) || '0.00'}</div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.close();
            }, 200);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

   
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const tenantId = localStorage.getItem('tenantId');
      
        if (!token || !tenantId) {
          throw new Error('Authentication token or tenant ID is missing.');
        }

        const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
        const endpoint = `${baseUrl}/api/product/all`;
        //console.log('Fetching from endpoint:', endpoint);

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
          },
        });

        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Response: ${responseText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);

        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
        setFilteredProducts(productList);

        if (productList.length === 0) {
          setErrorMessage('No products found. Please check the server.');
        }
      } catch (err) {
        setErrorMessage(`Error fetching products: ${err.message}. Please verify the server or endpoint.`);
        console.error('Fetch Products Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  //handle particular id
   const handleView = (product) => {
    setSelectview(product);
    setViewopen(true);
  };

  //handle delete
const handleDelete = async (productId) => {
  const confirmed = await confirmDeletePopup();
  if (!confirmed) return;

  try {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

    const res = await fetch(`${baseUrl}/api/product/delete/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong.');
    }

    toast.success('✅ Product deleted successfully');
    fetchProducts?.(); // optional refresh
  } catch (err) {
    console.error(err);
    toast.error(`❌ ${err.message}`);
  }
};



  // Handle filter change
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);

    let updatedProducts = products;
    if (showLowStock) {
      updatedProducts = products.filter(
        (product) => product.quantity <= (product.minStockAlert || Infinity)
      );
    }

    if (value) {
      updatedProducts = updatedProducts.filter(
        (product) =>
          (product.productName || '').toLowerCase().includes(value.toLowerCase()) ||
          (product.subcategory || '').toLowerCase().includes(value.toLowerCase()) ||
          (product.brand || '').toLowerCase().includes(value.toLowerCase())
      );
    }

    setFilteredProducts(updatedProducts);
  };

  // Toggle low stock products
  const toggleLowStock = () => {
    setShowLowStock((prev) => !prev);
    if (!showLowStock) {
      let lowStockProducts = products.filter(
        (product) => product.quantity <= (product.minStockAlert || Infinity)
      );
      if (filter) {
        lowStockProducts = lowStockProducts.filter(
          (product) =>
            (product.productName || '').toLowerCase().includes(filter.toLowerCase()) ||
            (product.subcategory || '').toLowerCase().includes(filter.toLowerCase()) ||
            (product.brand || '').toLowerCase().includes(filter.toLowerCase())
        );
      }
      setFilteredProducts(lowStockProducts);
    } else {
      const filtered = filter
        ? products.filter(
            (product) =>
              (product.productName || '').toLowerCase().includes(filter.toLowerCase()) ||
              (product.subcategory || '').toLowerCase().includes(filter.toLowerCase()) ||
              (product.brand || '').toLowerCase().includes(filter.toLowerCase())
          )
        : products;
      setFilteredProducts(filtered);
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setSelectedProduct(product);
  };

  // Handle save
  const handleSave = async (updatedProduct) => {
    try {
      const token = localStorage.getItem('token');
      const tenantId = localStorage.getItem('tenantId');
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
      const endpoint = `${baseUrl}/api/product/update/${updatedProduct._id}`;

      console.log('Sending update request to:', endpoint);
      console.log('Request body:', updatedProduct);
      console.log('Token:', token);
      console.log('Tenant ID:', tenantId);
      console.log('Full headers:', {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
      });

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify(updatedProduct),
      });

      // Always parse response as text first to debug
      const textResponse = await response.text();
      console.log('Raw response:', textResponse);

      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (e) {
        console.error('Failed to parse response as JSON:', textResponse);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed response:', result);

      if (!response.ok) {
        if (response.status === 404) {
          alert('Product not found or unauthorized access.');
        } else if (response.status === 500) {
          alert('Something went wrong while updating the product.');
        } else {
          alert(`Error: ${result.message || 'Unknown error'}`);
        }
        return;
      }

      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? result.product : p))
      );
      setFilteredProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? result.product : p))
      );
      toast('Product updated successfully.');
    } catch (err) {
      console.error('Update error:', err);
      alert('Something went wrong while updating the product.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="text-lg text-blue-600 font-semibold animate-pulse">
            Loading products, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (


    <div className="fixed top-0 left-[250px] w-[calc(100%-250px)] h-screen overflow-y-auto bg-white p-6">
      <div className="w-full h-full bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-600 mb-6 flex items-center animate-fade-in">
          <PlusCircleIcon className="w-10 h-10 mr-3 text-blue-500" />
          All Products
        </h2>

        {/* Single Filter Input */}
        <div className="mb-6">
          <input
            type="text"
            value={filter}
            onChange={handleFilterChange}
            placeholder="Filter by Product Name, Subcategory, or Brand"
            className="w-full md:w-1/2 p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
          />
        </div>

      

        {/* Low Stock Button */}
        <div className="mb-6">
          <button
            onClick={toggleLowStock}
            className={`px-6 py-3 rounded-full font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              showLowStock
                ? 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'
                : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
            }`}
          >
            {showLowStock ? 'Show All Products' : 'Show Low Stock Products'}
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 animate-slide-up">
            {errorMessage}
          </div>
        )}

        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-blue-100">
            <table className="min-w-full bg-white">
              <thead className="sticky top-0 bg-blue-50 text-blue-700">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Category</th>
                  <th className="py-4 px-6 text-left font-semibold">Unit Type</th>
                  <th className="py-4 px-6 text-left font-semibold">Quantity</th>
                  <th className="py-4 px-6 text-left font-semibold">Purchase Price</th>
                  <th className="py-4 px-6 text-left font-semibold">Selling Price</th>
                  <th className="py-4 px-6 text-left font-semibold">SKU</th>
                  <th className="py-4 px-6 text-left font-semibold">Barcode</th>
                  <th className="py-4 px-6 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => {
                  const isLowStock = product.quantity <= (product.minStockAlert || Infinity);
                  return (
                    <tr
                      key={product._id}
                      className={`border-b border-blue-100 hover:bg-blue-50 transition-all duration-300 animate-slide-up ${
                        isLowStock ? 'bg-red-50' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="py-4 px-6 text-gray-800">{product.productName || 'N/A'}</td>
                      <td className="py-4 px-6 text-gray-800">{product.category || 'N/A'}</td>
                      <td className="py-4 px-6 text-gray-800">{product.unitType || 'N/A'}</td>
                      <td className="py-4 px-6 flex items-center">
                        <span className={isLowStock ? 'text-red-600 font-bold' : 'text-gray-800'}>
                          {product.quantity ?? 'N/A'}
                        </span>
                        {isLowStock && (
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 ml-2" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-800">{product.purchasePrice ?? 'N/A'}</td>
                      <td className="py-4 px-6 text-gray-800">{product.sellingPrice ?? 'N/A'}</td>
                      <td className="py-4 px-6 text-gray-800">{product.sku || 'N/A'}</td>
                   <td className="py-4 px-6">
  {product.barcode ? (
    <button
      onClick={() => handlePrintBarcode(product)}
      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-blue rounded-md hover:bg-blue-700  text-blue transition-colors"
    >
      <PrinterIcon className="w-4 h-4 mr-1.5 text-black " />
      Print
    </button>
  ) : (
    <span className="text-gray-400">N/A</span>
  )}
</td>

                     <td className="py-4 px-6">
  <div className="flex items-center space-x-3">
    {/* Edit Button */}
    <button
    name=''
      onClick={() => handleEdit(product)}
      className="p-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <PencilIcon className="w-5 h-5" />
    </button>

    {/* View Button */}
    <button
      onClick={() => handleView(product)}
      className="p-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
    >
      <EyeIcon className="w-5 h-5" />
    </button>

    {/* model for product id  */}
     <ProductDetailsModal
        isOpen={viewopen}
        onClose={() => setViewopen(false)}
        product={selectview}
      />

    {/* Delete Button */}
   <button
  onClick={() => handleDelete(product._id)}
  className="p-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
>
  <TrashIcon className="w-5 h-5" />
</button>
  </div>
</td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 text-lg animate-fade-in">
            No products found.
          </div>
        )}
      </div>
      {selectedProduct && (
        <EditProduct
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={handleSave}
        />
      )}


 
 {/* for printing barcode */}

      {printBarcodeData && (
  <div className="fixed inset-0 bg-tranparent bg-opacity-50 flex  items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Print Barcode</h3>
          <button 
            onClick={() => setPrintBarcodeData(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <div className="text-center mb-6">
          <h4 className="font-medium text-gray-900">{printBarcodeData.productName}</h4>
          <div>SKU: ${printBarcodeData.sku}</div>
            <div>Price: ₹{printBarcodeData.sellingPrice?.toFixed(2) || '0.00'}</div>
          <img 
            src={printBarcodeData.barcode} 
            alt="Barcode" 
            className="mx-auto h-40 object-contain mt-4 border border-gray-200 p-2"
          />
           
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setPrintBarcodeData(null)}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700  border border-gray-300 rounded-md text-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={printBarcode}
            className="px-4 py-2 bg-blue-600 bg-gradient-to-r from-green-500 to-green-700  text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <PrinterIcon className="w-5 h-5 mr-2 text-blue" />
            Print Now
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default GetAllProducts;