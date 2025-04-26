import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import Layout from './components/Layout';
import "./tailwind.css";

// Import komponentów stron - usuwam nieistniejące ProfilePage i ClientDashboard
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import ClientDetailPage from './pages/ClientDetailPage.jsx';
import AnalysisPage from './pages/AnalysisPage.jsx';
import NewAnalysisPage from './pages/NewAnalysisPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import CarePlansPage from './pages/CarePlansPage.jsx';
import CarePlanDetailPage from './pages/CarePlanDetailPage.jsx';
import ChatPage from './pages/ChatPage.jsx';

// Komponent chroniący ścieżki - poprawiony
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Funkcja do określania strony domyślnej na podstawie roli
const RoleRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return <Navigate to="/admin" />;
  } else {
    // Zamiast /dashboard, przekierowujemy na stronę ClientsPage
    return <Navigate to="/clients" />;
  }
};

// Główna aplikacja
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              {/* Automatyczne przekierowanie po zalogowaniu */}
              <Route path="/" element={
                <ProtectedRoute>
                  <RoleRedirect />
                </ProtectedRoute>
              } />

              {/* Panel administratora */}
              <Route path="/admin" element={
                <ProtectedRoute><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/clients" element={
                <ProtectedRoute><ClientsPage /></ProtectedRoute>
              } />
              <Route path="/clients/:id" element={
                <ProtectedRoute><ClientDetailPage /></ProtectedRoute>
              } />
              <Route path="/analyses" element={
                <ProtectedRoute><AnalysisPage /></ProtectedRoute>
              } />
              <Route path="/analyses/new" element={
                <ProtectedRoute><NewAnalysisPage /></ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute><ProductsPage /></ProtectedRoute>
              } />
              <Route path="/care-plans" element={
                <ProtectedRoute><CarePlansPage /></ProtectedRoute>
              } />
              <Route path="/care-plans/:id" element={
                <ProtectedRoute><CarePlanDetailPage /></ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute><ChatPage /></ProtectedRoute>
              } />

              {/* Panel klienta - zamiast nieistniejących stron, wykorzystujemy istniejące */}
              {/* Zastępuję ClientDashboard stroną ClientsPage */}
              <Route path="/dashboard" element={
                <ProtectedRoute><ClientsPage /></ProtectedRoute>
              } />
              {/* Zastępuję ProfilePage stroną ClientDetailPage */}
              <Route path="/profile" element={
                <ProtectedRoute><ClientDetailPage /></ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;