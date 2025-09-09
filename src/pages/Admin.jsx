import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const Admin = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('contracts');
  const [contracts, setContracts] = useState([]);
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Contract form state
  const [contractForm, setContractForm] = useState({
    title: '',
    entity: '',
    amount: '',
    date: '',
    description: '',
    status: 'active'
  });

  // Load data
  useEffect(() => {
    loadContracts();
    loadPetitions();
  }, []);

  const loadContracts = async () => {
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
      // Mock data for demo
      setContracts([
        {
          id: '1',
          title: 'Contrato de Servicios de Limpieza',
          entity: 'Municipalidad Central',
          amount: '$50,000',
          date: '2024-12-15',
          description: 'Servicios de limpieza para edificios municipales',
          status: 'active'
        },
        {
          id: '2',
          title: 'Mantenimiento de Vialidad',
          entity: 'Secretaría de Obras Públicas',
          amount: '$120,000',
          date: '2024-11-20',
          description: 'Mantenimiento y reparación de calles principales',
          status: 'completed'
        }
      ]);
    }
  };

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
          description: 'Los vecinos del sector norte solicitan mejorar el sistema de alumbrado público',
          citizenName: 'María González',
          citizenEmail: 'maria@email.com',
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Petición para Parque Infantil',
          description: 'Solicitud para la construcción de un parque infantil en la colonia Las Flores',
          citizenName: 'Carlos Rodríguez',
          citizenEmail: 'carlos@email.com',
          status: 'in_review',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const handleContractSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'contracts'), {
        ...contractForm,
        createdAt: new Date().toISOString()
      });
      
      setContractForm({
        title: '',
        entity: '',
        amount: '',
        date: '',
        description: '',
        status: 'active'
      });
      
      loadContracts();
      alert('Contrato agregado exitosamente');
    } catch (error) {
      console.log('Demo mode: Contract would be added to database');
      alert('Demo: Contrato agregado (modo demostración)');
      
      // Add to local state for demo
      const newContract = {
        id: Date.now().toString(),
        ...contractForm,
        createdAt: new Date().toISOString()
      };
      setContracts([newContract, ...contracts]);
      
      setContractForm({
        title: '',
        entity: '',
        amount: '',
        date: '',
        description: '',
        status: 'active'
      });
    }
    
    setLoading(false);
  };

  const updatePetitionStatus = async (petitionId, newStatus) => {
    try {
      await updateDoc(doc(db, 'petitions', petitionId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      loadPetitions();
    } catch (error) {
      console.log('Demo mode: Status would be updated in database');
      // Update local state for demo
      setPetitions(petitions.map(p => 
        p.id === petitionId ? { ...p, status: newStatus } : p
      ));
    }
  };

  const deleteContract = async (contractId) => {
    if (!window.confirm('¿Estás seguro de eliminar este contrato?')) return;
    
    try {
      await deleteDoc(doc(db, 'contracts', contractId));
      loadContracts();
    } catch (error) {
      console.log('Demo mode: Contract would be deleted from database');
      setContracts(contracts.filter(c => c.id !== contractId));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'contracts', name: 'Gestión de Contratos', icon: '📋' },
    { id: 'petitions', name: 'Revisar Peticiones', icon: '📝' },
    { id: 'analytics', name: 'Estadísticas', icon: '📊' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        👨‍💼 Panel Administrativo
      </h1>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
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

      {/* Contracts Tab */}
      {activeTab === 'contracts' && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add Contract Form */}
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Agregar Nuevo Contrato
            </h2>
            
            <form onSubmit={handleContractSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Título del Contrato
                </label>
                <input
                  type="text"
                  value={contractForm.title}
                  onChange={(e) => setContractForm({...contractForm, title: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Entidad
                </label>
                <input
                  type="text"
                  value={contractForm.entity}
                  onChange={(e) => setContractForm({...contractForm, entity: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Monto
                  </label>
                  <input
                    type="text"
                    value={contractForm.amount}
                    onChange={(e) => setContractForm({...contractForm, amount: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="$0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={contractForm.date}
                    onChange={(e) => setContractForm({...contractForm, date: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Descripción
                </label>
                <textarea
                  value={contractForm.description}
                  onChange={(e) => setContractForm({...contractForm, description: e.target.value})}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Estado
                </label>
                <select
                  value={contractForm.status}
                  onChange={(e) => setContractForm({...contractForm, status: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="active">Activo</option>
                  <option value="completed">Completado</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Agregando...' : 'Agregar Contrato'}
              </button>
            </form>
          </div>

          {/* Contracts List */}
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Contratos Registrados ({contracts.length})
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contracts.map((contract) => (
                <div key={contract.id} className={`p-4 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {contract.title}
                    </h3>
                    <button
                      onClick={() => deleteContract(contract.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                    <p><strong>Entidad:</strong> {contract.entity}</p>
                    <p><strong>Monto:</strong> {contract.amount}</p>
                    <p><strong>Fecha:</strong> {contract.date}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {contract.status === 'active' ? 'Activo' : 'Completado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Petitions Tab */}
      {activeTab === 'petitions' && (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Peticiones Ciudadanas ({petitions.length})
          </h2>
          
          <div className="space-y-6">
            {petitions.map((petition) => (
              <div key={petition.id} className={`p-6 border rounded-lg ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {petition.title}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                      {petition.description}
                    </p>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <p><strong>Ciudadano:</strong> {petition.citizenName}</p>
                      <p><strong>Email:</strong> {petition.citizenEmail}</p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(petition.status)}`}>
                    {petition.status === 'pending' && 'Pendiente'}
                    {petition.status === 'in_review' && 'En Revisión'}
                    {petition.status === 'approved' && 'Aprobada'}
                    {petition.status === 'rejected' && 'Rechazada'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => updatePetitionStatus(petition.id, 'in_review')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    En Revisión
                  </button>
                  <button
                    onClick={() => updatePetitionStatus(petition.id, 'approved')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => updatePetitionStatus(petition.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
            <div className="text-3xl mb-2">📋</div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              {contracts.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Contratos Totales
            </div>
          </div>
          
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
            <div className="text-3xl mb-2">📝</div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              {petitions.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Peticiones Recibidas
            </div>
          </div>
          
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
            <div className="text-3xl mb-2">👥</div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              {petitions.filter(p => p.status === 'approved').length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Peticiones Aprobadas
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;