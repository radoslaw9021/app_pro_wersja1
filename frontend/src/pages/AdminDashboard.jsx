import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeAnalyses: 0,
    pendingCarePlans: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Placeholder dla pobierania danych
    console.log('Fetching admin dashboard data');
    // Tutaj będzie pobieranie danych z API
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Clients</h2>
            <p className="text-3xl font-bold text-purple-600">{stats.totalClients}</p>
            <Link to="/clients" className="text-purple-600 hover:underline mt-2 inline-block">View all clients</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Active Analyses</h2>
            <p className="text-3xl font-bold text-purple-600">{stats.activeAnalyses}</p>
            <Link to="/analyses" className="text-purple-600 hover:underline mt-2 inline-block">View all analyses</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Pending Care Plans</h2>
            <p className="text-3xl font-bold text-purple-600">{stats.pendingCarePlans}</p>
            <Link to="/care-plans" className="text-purple-600 hover:underline mt-2 inline-block">View all care plans</Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {stats.recentActivity.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {stats.recentActivity.map((activity, index) => (
                <li key={index} className="py-3">
                  {/* Activity item placeholder */}
                  <p>Activity item will be displayed here</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent activity</p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/clients/new" className="bg-purple-100 p-4 rounded hover:bg-purple-200 text-center">
              Add New Client
            </Link>
            <Link to="/analyses/new" className="bg-purple-100 p-4 rounded hover:bg-purple-200 text-center">
              New Analysis
            </Link>
            <Link to="/products" className="bg-purple-100 p-4 rounded hover:bg-purple-200 text-center">
              Manage Products
            </Link>
            <Link to="/care-plans" className="bg-purple-100 p-4 rounded hover:bg-purple-200 text-center">
              View Care Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
