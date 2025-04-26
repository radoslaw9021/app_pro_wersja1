import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    // Placeholder dla pobierania danych produktów
    console.log('Fetching products data');
    // Tutaj będzie pobieranie danych z API
    setLoading(false);
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'cleanser', name: 'Cleansers' },
    { id: 'serum', name: 'Serums' },
    { id: 'moisturizer', name: 'Moisturizers' },
    { id: 'sunscreen', name: 'Sunscreens' },
    { id: 'treatment', name: 'Treatments' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product?.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
          <button className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
            Add New Product
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-4 border-b flex flex-wrap items-center">
            <div className="mr-4 mb-2 flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Placeholder dla kart produktów */}
                <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Product Image</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">Product Name</h3>
                    <p className="text-sm text-gray-500 mb-2">Category</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">$49.99</span>
                      <button className="text-purple-600 hover:text-purple-900 text-sm">Details</button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Product Image</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">Another Product</h3>
                    <p className="text-sm text-gray-500 mb-2">Category</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">$29.99</span>
                      <button className="text-purple-600 hover:text-purple-900 text-sm">Details</button>
                    </div>
                  </div>
                </div>
                
                {/* Więcej produktów będzie wyświetlanych tutaj */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
