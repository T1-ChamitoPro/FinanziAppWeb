import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import { crearCategoria } from '../services/finanziappService';

interface ModalCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriaCreada: () => void;
}

export const ModalCategoria: React.FC<ModalCategoriaProps> = ({ isOpen, onClose, onCategoriaCreada }) => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'INGRESO' | 'GASTO'>('GASTO');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await crearCategoria({ nombre, tipo });
      setNombre('');
      onCategoriaCreada();
      onClose();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || 'Error al crear la categoría');
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '24px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem' }}>Nueva Categoría</h3>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ✕
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de Categoría</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej. Suscripciones, Freelance..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de Movimiento</label>
            <select
              className="form-input"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'INGRESO' | 'GASTO')}
            >
              <option value="GASTO">Gasto</option>
              <option value="INGRESO">Ingreso</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};