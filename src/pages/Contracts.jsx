import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

const Contracts = () => {
  const { darkMode } = useTheme();
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedContract, setSelectedContract] = useState(null);

  useEffect(() => {
    loadContracts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contracts, searchTerm, entityFilter, statusFilter, sortBy, sortOrder]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'contracts'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const contractsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContracts(contractsData);
    } catch (error) {
      console.log('Demo mode: Using mock data for contracts');
      // Comprehensive mock data for demo
      setContracts([
        {
          id: '1',
          title: 'Contrato de Servicios de Limpieza Municipal',
          entity: 'Municipalidad Central',
          contractor: 'Servicios de Aseo Profesional S.A.',
          amount: '$50,000',
          numericAmount: 50000,
          date: '2024-12-15',
          duration: '12 meses',
          description: 'Servicios de limpieza para edificios municipales, incluyendo oficinas administrativas, bibliotecas públicas y centros comunitarios.',
          status: 'active',
          category: 'Servicios',
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        },
        {
          id: '2',
          title: 'Mantenimiento de Vialidad y Pavimentación',
          entity: 'Secretaría de Obras Públicas',
          contractor: 'Constructora Vial del Norte Ltda.',
          amount: '$120,000',
          numericAmount: 120000,
          date: '2024-11-20',
          duration: '8 meses',
          description: 'Mantenimiento y reparación de calles principales, bacheo, pintura de señalización vial y reparación de aceras.',
          status: 'active',
          category: 'Infraestructura',
          startDate: '2024-11-01',
          endDate: '2025-06-30'
        },
        {
          id: '3',
          title: 'Suministro de Equipos Médicos',
          entity: 'Hospital General Municipal',
          contractor: 'Equipos Médicos del Sur S.A.',
          amount: '$85,000',
          numericAmount: 85000,
          date: '2024-10-10',
          duration: '6 meses',
          description: 'Adquisición e instalación de equipos médicos especializados para el área de emergencias y cuidados intensivos.',
          status: 'completed',
          category: 'Salud',
          startDate: '2024-10-01',
          endDate: '2024-12-31'
        },
        {
          id: '4',
          title: 'Sistema de Iluminación LED',
          entity: 'Departamento de Servicios Públicos',
          contractor: 'Iluminación Eficiente Corp.',
          amount: '$95,000',
          numericAmount: 95000,
          date: '2024-09-05',
          duration: '10 meses',
          description: 'Implementación de sistema de alumbrado público LED en zonas residenciales y comerciales del centro de la ciudad.',
          status: 'active',
          category: 'Infraestructura',
          startDate: '2024-09-01',
          endDate: '2025-06-30'
        },
        {
          id: '5',
          title: 'Programa de Alimentación Escolar',
          entity: 'Secretaría de Educación',
          contractor: 'Alimentos Nutritivos S.A.',
          amount: '$200,000',
          numericAmount: 200000,
          date: '2024-08-15',
          duration: '12 meses',
          description: 'Suministro de alimentos para el programa de alimentación escolar que beneficia a 5,000 estudiantes de escuelas públicas.',
          status: 'active',
          category: 'Educación',
          startDate: '2024-09-01',
          endDate: '2025-08-31'
        },
        {
          id: '6',
          title: 'Modernización del Sistema de Agua Potable',
          entity: 'Empresa Municipal de Agua',
          contractor: 'Hidráulica Moderna Ltda.',
          amount: '$180,000',
          numericAmount: 180000,
          date: '2024-07-20',
          duration: '18 meses',
          description: 'Modernización de la red de distribución de agua potable, incluyendo tuberías, válvulas y sistemas de medición.',
          status: 'active',
          category: 'Servicios Públicos',
          startDate: '2024-08-01',
          endDate: '2026-01-31'
        },
        {
          id: '7',
          title: 'Construcción de Centro Comunitario',
          entity: 'Municipalidad Central',
          contractor: 'Constructora Comunitaria S.A.',
          amount: '$150,000',
          numericAmount: 150000,
          date: '2024-06-30',
          duration: '14 meses',
          description: 'Construcción de centro comunitario con salón de eventos, biblioteca y aulas de capacitación en el barrio San Pedro.',
          status: 'in_progress',
          category: 'Infraestructura',
          startDate: '2024-07-01',
          endDate: '2025-08-31'
        },
        {
          id: '8',
          title: 'Sistema de Videovigilancia',
          entity: 'Departamento de Seguridad',
          contractor: 'Seguridad Tecnológica Ltda.',
          amount: '$75,000',
          numericAmount: 75000,
          date: '2024-05-15',
          duration: '6 meses',
          description: 'Instalación de sistema de videovigilancia en plazas públicas, parques y centros comerciales para mejorar la seguridad ciudadana.',
          status: 'completed',
          category: 'Seguridad',
          startDate: '2024-05-01',
          endDate: '2024-10-31'
        }
      ]);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...contracts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Entity filter
    if (entityFilter !== 'all') {
      filtered = filtered.filter(contract => contract.entity === entityFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.numericAmount || parseFloat(a.amount.replace(/[$,]/g, '')) || 0;
          bValue = b.numericAmount || parseFloat(b.amount.replace(/[$,]/g, '')) || 0;
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = a.date;
          bValue = b.date;
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    setFilteredContracts(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'Activo',
      completed: 'Completado',
      in_progress: 'En Progreso',
      cancelled: 'Cancelado'
    };
    return texts[status] || status;
  };

  const formatAmount = (amount) => {
    if (typeof amount === 'string') return amount;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTotalAmount = () => {
    return filteredContracts.reduce((total, contract) => {
      const amount = contract.numericAmount || parseFloat(contract.amount.replace(/[$,]/g, '')) || 0;
      return total + amount;
    }, 0);
  };

  const getUniqueEntities = () => {
    return [...new Set(contracts.map(contract => contract.entity))];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Cargando contratos públicos...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📋 Contratos Públicos
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
          Consulta la información completa sobre contratos públicos. Accede a datos transparentes sobre licitaciones, 
          proveedores y el uso de recursos públicos.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
          <div className="text-3xl mb-2">📋</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            {filteredContracts.length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Contratos Total
          </div>
        </div>

        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
          <div className="text-3xl mb-2">💰</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
            {formatAmount(getTotalAmount())}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Valor Total
          </div>
        </div>

        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
          <div className="text-3xl mb-2">✅</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
            {contracts.filter(c => c.status === 'active').length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Contratos Activos
          </div>
        </div>

        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
          <div className="text-3xl mb-2">🏢</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
            {getUniqueEntities().length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Entidades
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-6`}>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Buscar contratos, entidades o proveedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>

          {/* Entity Filter */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">Todas las entidades</option>
            {getUniqueEntities().map((entity) => (
              <option key={entity} value={entity}>
                {entity}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="completed">Completados</option>
            <option value="in_progress">En Progreso</option>
            <option value="cancelled">Cancelados</option>
          </select>

          {/* Sort Options */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="date">Fecha</option>
              <option value="amount">Monto</option>
              <option value="title">Título</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-6">
        {filteredContracts.map((contract) => (
          <div key={contract.id} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-shadow`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {contract.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(contract.status)}`}>
                    {getStatusText(contract.status)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {contract.category}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(contract.date).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                  {contract.amount}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {contract.duration}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Información del Contrato
                </h4>
                <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p><strong>Entidad:</strong> {contract.entity}</p>
                  <p><strong>Contratista:</strong> {contract.contractor}</p>
                  <p><strong>Inicio:</strong> {new Date(contract.startDate).toLocaleDateString('es-ES')}</p>
                  <p><strong>Fin:</strong> {new Date(contract.endDate).toLocaleDateString('es-ES')}</p>
                </div>
              </div>

              <div>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Descripción
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {contract.description}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedContract(contract)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Ver detalles completos →
              </button>
              
              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                ID: {contract.id}
              </div>
            </div>
          </div>
        ))}

        {filteredContracts.length === 0 && (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg">No se encontraron contratos con los criterios seleccionados.</p>
            <p className="text-sm mt-2">Intenta ajustar los filtros de búsqueda.</p>
          </div>
        )}
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-2xl w-full max-h-96 overflow-y-auto rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Detalles del Contrato
              </h3>
              <button
                onClick={() => setSelectedContract(null)}
                className={`text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedContract.title}
                </h4>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedContract.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h5 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Información Contractual
                  </h5>
                  <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p><strong>Entidad:</strong> {selectedContract.entity}</p>
                    <p><strong>Contratista:</strong> {selectedContract.contractor}</p>
                    <p><strong>Monto:</strong> {selectedContract.amount}</p>
                    <p><strong>Duración:</strong> {selectedContract.duration}</p>
                    <p><strong>Estado:</strong> {getStatusText(selectedContract.status)}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h5 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Fechas Importantes
                  </h5>
                  <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p><strong>Fecha de Contrato:</strong> {new Date(selectedContract.date).toLocaleDateString('es-ES')}</p>
                    <p><strong>Inicio:</strong> {new Date(selectedContract.startDate).toLocaleDateString('es-ES')}</p>
                    <p><strong>Finalización:</strong> {new Date(selectedContract.endDate).toLocaleDateString('es-ES')}</p>
                    <p><strong>Categoría:</strong> {selectedContract.category}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedContract(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;