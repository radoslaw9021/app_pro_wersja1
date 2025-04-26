import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Placeholder dla pobierania danych klientów
    console.log('Fetching clients data');
    // Tutaj będzie pobieranie danych z API
    setLoading(false);
  }, []);

  const filteredClients = clients.filter(client => 
    client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Clients</h1>
          <Link to="/clients/new" className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
            Add New Client
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <p>Loading clients...</p>
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Analysis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Placeholder dla wierszy tabeli klientów */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Client Name</td>
                    <td className="px-6 py-4 whitespace-nowrap">client@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jan 15, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to="/clients/1" className="text-purple-600 hover:text-purple-900 mr-3">View</Link>
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No clients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
