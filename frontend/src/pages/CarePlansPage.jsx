import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CarePlansPage = () => {
  const [carePlans, setCarePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Placeholder dla pobierania danych planów pielęgnacyjnych
    console.log('Fetching care plans data');
    // Tutaj będzie pobieranie danych z API
    setLoading(false);
  }, []);

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'draft', label: 'Draft' }
  ];

  const filteredCarePlans = carePlans.filter(plan => {
    const matchesSearch = plan?.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Care Plans</h1>
          <button className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
            Create New Care Plan
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-4 border-b flex flex-wrap items-center">
            <div className="mr-4 mb-2 flex-grow">
              <input
                type="text"
                placeholder="Search by client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <p>Loading care plans...</p>
            </div>
          ) : filteredCarePlans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Placeholder dla wierszy tabeli planów pielęgnacyjnych */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Client Name</td>
                    <td className="px-6 py-4 whitespace-nowrap">Apr 15, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Skin Care</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to="/care-plans/1" className="text-purple-600 hover:text-purple-900 mr-3">View</Link>
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-gray-600 hover:text-gray-900">Share</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Another Client</td>
                    <td className="px-6 py-4 whitespace-nowrap">Apr 10, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Draft
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Hair Care</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to="/care-plans/2" className="text-purple-600 hover:text-purple-900 mr-3">View</Link>
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-gray-600 hover:text-gray-900">Share</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No care plans found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarePlansPage;
