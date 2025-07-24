import React, { useState, useEffect } from 'react';
import { PlusCircleIcon, ExclamationTriangleIcon, PencilIcon } from '@heroicons/react/24/solid';
import EditProduct from './EditProduct'; // Adjust path as per your project structure

const GetAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const tenantId = localStorage.getItem('tenantId');
        console.log('Token:', token);
        console.log('Tenant ID:', tenantId);

        if (!token || !tenantId) {
          throw new Error('Authentication token or tenant ID is missing.');
        }

        const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
        const endpoint = `${baseUrl}/api/product/all`;
        console.log('Fetching from endpoint:', endpoint);

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
      alert('Product updated successfully.');
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
                  <th className="py-4 px-6 text-left font-semibold">Edit</th>
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
                          <a
                            href={product.barcode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 font-semibold rounded-full hover:from-blue-600 hover:to-blue-800 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            style={{ color: 'white' }}
                          >
                            Barcode
                          </a>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleEdit(product)}
                          className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full hover:from-blue-600 hover:to-blue-800 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          style={{ color: 'white' }}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
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
    </div>
  );
};

export default GetAllProducts;