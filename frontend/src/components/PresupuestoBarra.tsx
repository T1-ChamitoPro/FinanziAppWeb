import React, { useState } from 'react';
import type { Transaccion } from '../services/finanziappService';

interface PresupuestoBarraProps {
  transacciones: Transaccion[];
}

export const PresupuestoBarra: React.FC<PresupuestoBarraProps> = ({ transacciones }) => {
  const [limite, setLimite] = useState<number>(() => {
    const guardado = localStorage.getItem('finanziapp_limite_presupuesto');
    return guardado ? Number(guardado) : 2000000; // Límite por defecto
  });
  const [editando, setEditando] = useState(false);
  const [nuevoLimite, setNuevoLimite] = useState(limite.toString());

  // Obtener mes y año actual (AAAA-MM)
  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const anioActual = fechaActual.getFullYear();

  // Sumar solo gastos del mes en curso
  const gastosDelMes = transacciones
    .filter((t) => {
      const fechaTx = new Date(t.fecha);
      return (
        t.categoria?.tipo === 'GASTO' &&
        fechaTx.getMonth() === mesActual &&
        fechaTx.getFullYear() === anioActual
      );
    })
    .reduce((acc, t) => acc + t.monto, 0);

  const porcentaje = Math.min(Math.round((gastosDelMes / (limite || 1)) * 100), 100);

  // Definir color según el nivel de consumo
  let colorBarra = 'var(--success)';
  if (porcentaje >= 80 && porcentaje < 100) colorBarra = 'var(--warning)';
  if (porcentaje >= 100) colorBarra = 'var(--danger)';

  const guardarLimite = (e: React.FormEvent) => {
    e.preventDefault();
    const valor = Number(nuevoLimite);
    if (valor > 0) {
      setLimite(valor);
      localStorage.setItem('finanziapp_limite_presupuesto', valor.toString());
      setEditando(false);
    }
  };

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px 24px',
      marginBottom: '32px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Presupuesto Mensual
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Gastos acumulados este mes
          </span>
        </div>

        {editando ? (
          <form onSubmit={guardarLimite} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              className="form-input"
              value={nuevoLimite}
              onChange={(e) => setNuevoLimite(e.target.value)}
              style={{ width: '120px', padding: '4px 8px', fontSize: '0.85rem' }}
              autoFocus
            />
            <button type="submit" className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
              Ok
            </button>
          </form>
        ) : (
          <button
            onClick={() => setEditando(true)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Editar límite (${limite.toLocaleString()})
          </button>
        )}
      </div>

      {/* Barra de progreso */}
      <div style={{
        height: '10px',
        backgroundColor: '#2d2d2d',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '8px'
      }}>
        <div style={{
          width: `${porcentaje}%`,
          height: '100%',
          backgroundColor: colorBarra,
          transition: 'width 0.4s ease, background-color 0.4s ease'
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <span style={{ color: colorBarra, fontWeight: 600 }}>
          ${gastosDelMes.toLocaleString()} ({porcentaje}%)
        </span>
        <span style={{ color: 'var(--text-muted)' }}>
          Límite: ${limite.toLocaleString()}
        </span>
      </div>

      {porcentaje >= 90 && (
        <p style={{
          marginTop: '10px',
          fontSize: '0.8rem',
          color: 'var(--danger)',
          fontWeight: 600,
          margin: '10px 0 0 0'
        }}>
          ⚠️ Alerta: Has superado el {porcentaje >= 100 ? '100%' : '90%'} de tu límite mensual configurado.
        </p>
      )}
    </div>
  );
};