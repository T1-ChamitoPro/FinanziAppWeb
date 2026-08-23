import React from 'react';
import { useAuth } from '../context/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        backgroundColor: 'var(--card-bg)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontWeight: 700 }}>
          FinanziApp
        </h2>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Hola, <strong style={{ color: 'var(--text-main)' }}>{user.nombre}</strong>
          </span>
          <button
            onClick={logout}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-main)',
              border: '1px solid var(--border)',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--border)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  );
};