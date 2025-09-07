import React from 'react';

const Home = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#007bff' }}>Transparencia Conectada</h1>
      <p>Plataforma de transparencia y participación ciudadana</p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(1, 1fr)', 
        gap: '10px', 
        maxWidth: '400px', 
        margin: '20px auto' 
      }}>
        {['Nuestro Objetivo', 'Propuesta de Valor', 'Manifiesto'].map((title, i) => (
          <div key={i} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{title}</h3>
            <p style={{ fontSize: '14px' }}>Principio fundamental de la plataforma</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
