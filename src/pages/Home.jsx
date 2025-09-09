import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { darkMode } = useTheme();

  const features = [
    {
      title: "Nuestro Objetivo",
      description: "Fortalecer la democracia a través de la transparencia gubernamental y el acceso libre a la información pública.",
      icon: "🎯"
    },
    {
      title: "Propuesta de Valor",
      description: "Una plataforma ética, modular y pública que redefine la interacción entre la ciudadanía y el gobierno.",
      icon: "💎"
    },
    {
      title: "Manifiesto",
      description: "Promovemos la rendición de cuentas, facilitamos el acceso a información y empoderamos a la ciudadanía digital.",
      icon: "📜"
    }
  ];

  const stats = [
    { number: "2025", label: "Año de Lanzamiento" },
    { number: "100%", label: "Código Abierto" },
    { number: "24/7", label: "Acceso Disponible" },
    { number: "🔒", label: "Datos Seguros" }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className={`text-5xl font-bold mb-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
          🌐 Transparencia Conectada
        </h1>
        <p className={`text-xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Una plataforma ética, modular y pública que redefine la interacción entre la ciudadanía y el gobierno, 
          promoviendo la transparencia institucional y la participación ciudadana.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link 
            to="/petitions" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Ver Peticiones
          </Link>
          <Link 
            to="/contracts" 
            className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-700'} px-8 py-3 rounded-lg font-semibold transition-colors`}
          >
            Buscar Contratos
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                {stat.number}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Características Principales
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-shadow`}>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <h2 className={`text-3xl font-bold text-center mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🛠️ Tecnologías Utilizadas
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "React.js + TypeScript",
            "Tailwind CSS",
            "Firebase Firestore",
            "Firebase Auth",
            "React Router DOM",
            "Vercel Hosting",
            "Diseño Responsive",
            "Modo Oscuro"
          ].map((tech, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} text-center font-medium`}>
              {tech}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16">
        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🤝 Únete a la Transparencia
        </h2>
        <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Contribuye al fortalecimiento de la democracia. Tu participación es fundamental para construir un gobierno más transparente y accesible.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/petitions" 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Hacer una Petición
          </Link>
          <Link 
            to="/admin" 
            className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-700'} px-8 py-3 rounded-lg font-semibold transition-colors`}
          >
            Panel Administrativo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
