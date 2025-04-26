import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AnalysisPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Placeholder dla pobierania danych analiz
    console.log('Fetching analyses data');
    // Tutaj będzie pobieranie danych z API
    setLoading(false);
  }, []);

  const filteredAnalyses = analyses.filter(analysis => {
    if (filter === 'all') return true;
    return analysis?.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Skin Analyses</h1>
          <Link to="/analyses/new" className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
            New Analysis
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-4 border-b flex flex-wrap items-center">
            <div className="mr-4 mb-2">
              <label className="mr-2 text-gray-700">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Analyses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <p>Loading analyses...</p>
            </div>
          ) : filteredAnalyses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Placeholder dla wierszy tabeli analiz */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Client Name</td>
                    <td className="px-6 py-4 whitespace-nowrap">Apr 15, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Skin Analysis</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-purple-600 hover:text-purple-900 mr-3">View</button>
                      <button className="text-blue-600 hover:text-blue-900">Process</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No analyses found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
