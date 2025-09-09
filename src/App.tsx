import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Petitions from './pages/Petitions';
import Contracts from './pages/Contracts';
import './App.css';

const Navigation = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'} p-4 shadow-lg`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-200">
          🌐 Transparencia Conectada
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Inicio
          </Link>
          <Link to="/petitions" className="hover:text-blue-200 transition-colors">
            Peticiones
          </Link>
          <Link to="/contracts" className="hover:text-blue-200 transition-colors">
            Contratos
          </Link>
          <Link to="/admin" className="hover:text-blue-200 transition-colors">
            Admin
          </Link>
          
          <button
            onClick={toggleDarkMode}
            className="ml-4 p-2 rounded-lg bg-opacity-20 bg-white hover:bg-opacity-30 transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

function AppContent() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/petitions" element={<Petitions />} />
          <Route path="/contracts" element={<Contracts />} />
        </Routes>
      </main>
      
      <footer className={`${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} p-8 mt-16`}>
        <div className="container mx-auto text-center">
          <p className="mb-4">© 2025 Portal de Transparencia Conectada</p>
          <p className="text-sm">Desarrollado por Fanny Design Style - Estefanía Pérez Vázquez</p>
          <p className="text-sm mt-2">📧 fannydesignstyle@outlook.com | 📱 951 743 9204</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
