import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ClientDetailPage = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Placeholder dla pobierania danych klienta
    console.log(`Fetching client data for id: ${id}`);
    // Tutaj będzie pobieranie danych z API
    setLoading(false);
  }, [id]);

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'analyses', label: 'Analyses' },
    { id: 'carePlans', label: 'Care Plans' },
    { id: 'products', label: 'Recommended Products' },
    { id: 'notes', label: 'Notes' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/clients" className="text-purple-600 hover:underline">&larr; Back to Clients</Link>
        </div>
        
        {loading ? (
          <div className="text-center p-8">
            <p>Loading client data...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Client Name Placeholder</h1>
                <div className="flex items-center text-gray-500 mb-6">
                  <span className="mr-4">client@example.com</span>
                  <span>Member since: Jan 1, 2025</span>
                </div>
                
                <div className="flex flex-wrap space-x-2">
                  <button className="bg-purple-600 text-white py-1 px-3 rounded text-sm">New Analysis</button>
                  <button className="bg-blue-600 text-white py-1 px-3 rounded text-sm">Create Care Plan</button>
                  <button className="bg-gray-600 text-white py-1 px-3 rounded text-sm">Send Message</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b">
                <nav className="flex">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`px-4 py-3 font-medium ${activeTab === tab.id ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 mb-1">Full Name</p>
                        <p>Client Name Placeholder</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Email</p>
                        <p>client@example.com</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Phone</p>
                        <p>+1 123-456-7890</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Date of Birth</p>
                        <p>January 1, 1990</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'analyses' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Skin Analyses</h2>
                    <p className="text-gray-500">Analysis history will be displayed here</p>
                  </div>
                )}
                
                {activeTab === 'carePlans' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Care Plans</h2>
                    <p className="text-gray-500">Care plans will be displayed here</p>
                  </div>
                )}
                
                {activeTab === 'products' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
                    <p className="text-gray-500">Recommended products will be displayed here</p>
                  </div>
                )}
                
                {activeTab === 'notes' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Client Notes</h2>
                    <p className="text-gray-500">Client notes will be displayed here</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientDetailPage;
