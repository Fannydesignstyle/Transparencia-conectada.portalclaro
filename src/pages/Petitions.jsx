import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';

const Petitions = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('submit');
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form state
  const [petitionForm, setPetitionForm] = useState({
    title: '',
    description: '',
    category: '',
    citizenName: '',
    citizenEmail: '',
    citizenPhone: ''
  });

  const categories = [
    'Infraestructura',
    'Servicios Públicos',
    'Medio Ambiente',
    'Seguridad',
    'Salud',
    'Educación',
    'Transporte',
    'Otros'
  ];

  useEffect(() => {
    loadPetitions();
  }, []);

  const loadPetitions = async () => {
    try {
      const q = query(collection(db, 'petitions'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const petitionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPetitions(petitionsData);
    } catch (error) {
      console.log('Demo mode: Using mock data for petitions');
      // Mock data for demo
      setPetitions([
        {
          id: '1',
          title: 'Solicitud de Mejora en Alumbrado Público',
          description: 'Los vecinos del sector norte solicitan mejorar el sistema de alumbrado público en las calles principales. La falta de iluminación adecuada representa un riesgo para la seguridad ciudadana, especialmente durante las horas nocturnas.',
          category: 'Infraestructura',
          citizenName: 'María González',
          citizenEmail: 'maria.gonzalez@email.com',
          citizenPhone: '555-0123',
          status: 'pending',
          createdAt: new Date('2024-12-01').toISOString(),
          responses: []
        },
        {
          id: '2',
          title: 'Petición para Parque Infantil',
          description: 'Solicitud para la construcción de un parque infantil en la colonia Las Flores. Los niños de la comunidad no tienen espacios seguros para recrearse y esto afecta su desarrollo.',
          category: 'Infraestructura',
          citizenName: 'Carlos Rodríguez',
          citizenEmail: 'carlos.rodriguez@email.com',
          citizenPhone: '555-0456',
          status: 'in_review',
          createdAt: new Date('2024-11-28').toISOString(),
          responses: [
            {
              date: new Date('2024-12-02').toISOString(),
              message: 'Su petición ha sido recibida y está siendo evaluada por el departamento correspondiente.',
              author: 'Administración Municipal'
            }
          ]
        },
        {
          id: '3',
          title: 'Mejora en Servicio de Recolección de Basura',
          description: 'Solicito mejoras en el horario y frecuencia del servicio de recolección de basura en el barrio San José. Actualmente el servicio es irregular.',
          category: 'Servicios Públicos',
          citizenName: 'Ana López',
          citizenEmail: 'ana.lopez@email.com',
          citizenPhone: '555-0789',
          status: 'approved',
          createdAt: new Date('2024-11-20').toISOString(),
          responses: [
            {
              date: new Date('2024-11-25').toISOString(),
              message: 'Su petición ha sido aprobada. Se implementará un nuevo horario de recolección a partir del próximo mes.',
              author: 'Departamento de Servicios Públicos'
            }
          ]
        },
        {
          id: '4',
          title: 'Solicitud de Semáforo en Intersección',
          description: 'Petición para instalar un semáforo en la intersección de Av. Principal con Calle 5ta. Se han registrado varios accidentes en esta zona.',
          category: 'Seguridad',
          citizenName: 'Roberto Martín',
          citizenEmail: 'roberto.martin@email.com',
          citizenPhone: '555-0321',
          status: 'rejected',
          createdAt: new Date('2024-11-15').toISOString(),
          responses: [
            {
              date: new Date('2024-11-30').toISOString(),
              message: 'Después de evaluar el flujo vehicular, se determina que un semáforo no es necesario en esta intersección. Se instalará señalización preventiva.',
              author: 'Departamento de Tránsito'
            }
          ]
        }
      ]);
    }
  };

  const handleSubmitPetition = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newPetition = {
      ...petitionForm,
      status: 'pending',
      createdAt: new Date().toISOString(),
      responses: []
    };

    try {
      await addDoc(collection(db, 'petitions'), newPetition);
      alert('Petición enviada exitosamente. Recibirás actualizaciones por email.');
    } catch (error) {
      console.log('Demo mode: Petition would be added to database');
      alert('Demo: Petición enviada exitosamente (modo demostración)');
      
      // Add to local state for demo
      const petitionWithId = {
        id: Date.now().toString(),
        ...newPetition
      };
      setPetitions([petitionWithId, ...petitions]);
    }

    setPetitionForm({
      title: '',
      description: '',
      category: '',
      citizenName: '',
      citizenEmail: '',
      citizenPhone: ''
    });

    setLoading(false);
    setActiveTab('view'); // Switch to view tab after submission
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_review: 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      in_review: 'En Revisión',
      approved: 'Aprobada',
      rejected: 'Rechazada'
    };
    return texts[status] || status;
  };

  const filteredPetitions = petitions.filter(petition => {
    const matchesSearch = petition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         petition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         petition.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || petition.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'submit', name: 'Enviar Petición', icon: '📝' },
    { id: 'view', name: 'Ver Peticiones', icon: '👁️' },
    { id: 'track', name: 'Seguimiento', icon: '📊' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📝 Peticiones Ciudadanas
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
          Participa activamente en la gestión pública. Envía tus peticiones y da seguimiento a las solicitudes de la comunidad.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex justify-center space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Submit Petition Tab */}
      {activeTab === 'submit' && (
        <div className={`max-w-2xl mx-auto p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Nueva Petición Ciudadana
          </h2>

          <form onSubmit={handleSubmitPetition} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Título de la Petición *
              </label>
              <input
                type="text"
                value={petitionForm.title}
                onChange={(e) => setPetitionForm({...petitionForm, title: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="Resuma brevemente su petición"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Categoría *
              </label>
              <select
                value={petitionForm.category}
                onChange={(e) => setPetitionForm({...petitionForm, category: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Descripción Detallada *
              </label>
              <textarea
                value={petitionForm.description}
                onChange={(e) => setPetitionForm({...petitionForm, description: e.target.value})}
                rows="6"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="Describe detalladamente tu petición, incluyendo ubicación específica si aplica..."
                required
              />
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Proporciona todos los detalles relevantes para facilitar la evaluación de tu petición.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={petitionForm.citizenName}
                  onChange={(e) => setPetitionForm({...petitionForm, citizenName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={petitionForm.citizenPhone}
                  onChange={(e) => setPetitionForm({...petitionForm, citizenPhone: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={petitionForm.citizenEmail}
                onChange={(e) => setPetitionForm({...petitionForm, citizenEmail: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="Tu correo para recibir actualizaciones"
                required
              />
            </div>

            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>
                <strong>Nota:</strong> Tu petición será revisada por las autoridades competentes. 
                Recibirás actualizaciones sobre el progreso a través del correo electrónico proporcionado.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando Petición...' : 'Enviar Petición'}
            </button>
          </form>
        </div>
      )}

      {/* View Petitions Tab */}
      {activeTab === 'view' && (
        <div>
          {/* Filters */}
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-6`}>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Buscar peticiones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="in_review">En Revisión</option>
                <option value="approved">Aprobadas</option>
                <option value="rejected">Rechazadas</option>
              </select>
            </div>
          </div>

          {/* Petitions List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Peticiones Públicas ({filteredPetitions.length})
              </h3>
            </div>

            {filteredPetitions.map((petition) => (
              <div key={petition.id} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {petition.title}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(petition.status)}`}>
                        {getStatusText(petition.status)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {petition.category}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(petition.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>

                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {petition.description}
                </p>

                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                  <p><strong>Solicitante:</strong> {petition.citizenName}</p>
                </div>

                {/* Responses */}
                {petition.responses && petition.responses.length > 0 && (
                  <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-4`}>
                    <h5 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Respuestas Oficiales:
                    </h5>
                    {petition.responses.map((response, index) => (
                      <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-3`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                            {response.author}
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(response.date).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {response.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredPetitions.length === 0 && (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p className="text-lg">No se encontraron peticiones con los criterios seleccionados.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Track Tab */}
      {activeTab === 'track' && (
        <div className={`max-w-4xl mx-auto p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Estadísticas de Peticiones
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} text-center`}>
              <div className="text-3xl mb-2">📝</div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                {petitions.length}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total de Peticiones
              </div>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} text-center`}>
              <div className="text-3xl mb-2">⏳</div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                {petitions.filter(p => p.status === 'pending').length}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Pendientes
              </div>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'} text-center`}>
              <div className="text-3xl mb-2">✅</div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                {petitions.filter(p => p.status === 'approved').length}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Aprobadas
              </div>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'} text-center`}>
              <div className="text-3xl mb-2">🔍</div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                {petitions.filter(p => p.status === 'in_review').length}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                En Revisión
              </div>
            </div>
          </div>

          {/* Categories breakdown */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Peticiones por Categoría
            </h3>
            <div className="space-y-3">
              {categories.map((category) => {
                const count = petitions.filter(p => p.category === category).length;
                const percentage = petitions.length ? (count / petitions.length) * 100 : 0;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {category}
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className={`w-32 h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className={`text-sm w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Petitions;