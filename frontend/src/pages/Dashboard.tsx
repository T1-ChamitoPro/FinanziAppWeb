import React, { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/useAuth';
import {
  getBalanceUsuario,
  getTransaccionesUsuario,
  getCategorias,
  crearTransaccion,
  eliminarTransaccion,
} from '../services/finanziappService';
import type { BalanceResponse, Transaccion, Categoria } from '../services/finanziappService';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const [balance, setBalance] = useState<BalanceResponse>({
    totalIngresos: 0,
    totalGastos: 0,
    balanceTotal: 0,
  });
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Estado del formulario
  const [monto, setMonto] = useState<number | ''>('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [idCategoria, setIdCategoria] = useState<number | ''>('');
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    if (!user) return;
    try {
      const [resBalance, resTransacciones, resCategorias] = await Promise.all([
        getBalanceUsuario(user.idUsuario),
        getTransaccionesUsuario(user.idUsuario),
        getCategorias(),
      ]);
      setBalance(resBalance.data);
      setTransacciones(resTransacciones.data);
      setCategorias(resCategorias.data);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || 'Error al cargar la información');
      }
    }
  };

    useEffect(() => {
    const cargarDatos = async () => {
        if (!user) return;
        try {
        const [resBalance, resTransacciones, resCategorias] = await Promise.all([
            getBalanceUsuario(user.idUsuario),
            getTransaccionesUsuario(user.idUsuario),
            getCategorias(),
        ]);
        setBalance(resBalance.data);
        setTransacciones(resTransacciones.data);
        setCategorias(resCategorias.data);
        } catch (err: unknown) {
        if (isAxiosError(err)) {
            setError(err.response?.data?.error || 'Error al cargar la información');
        }
        }
    };

    cargarDatos();
    }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !idCategoria || !monto) return;
    setError('');

    try {
      await crearTransaccion({
        monto: Number(monto),
        descripcion,
        fecha,
        idUsuario: user.idUsuario,
        idCategoria: Number(idCategoria),
      });

      // Limpiar formulario y recargar lista/balance
      setMonto('');
      setDescripcion('');
      setIdCategoria('');
      cargarDatos();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || 'Error al crear la transacción');
      }
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarTransaccion(id);
      cargarDatos();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || 'Error al eliminar');
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Hola, {user?.nombre} 👋</h2>
        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Tarjetas de Balance */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Ingresos</h3>
          <p style={{ color: 'green', fontSize: '1.2rem', fontWeight: 'bold' }}>
            ${balance.totalIngresos.toLocaleString()}
          </p>
        </div>
        <div style={{ flex: 1, padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Gastos</h3>
          <p style={{ color: 'red', fontSize: '1.2rem', fontWeight: 'bold' }}>
            ${balance.totalGastos.toLocaleString()}
          </p>
        </div>
        <div style={{ flex: 1, padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Balance Total</h3>
          <p style={{ color: balance.balanceTotal >= 0 ? 'blue' : 'red', fontSize: '1.2rem', fontWeight: 'bold' }}>
            ${balance.balanceTotal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Formulario de Registro */}
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Registrar Movimiento</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
          <input
            type="number"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value ? Number(e.target.value) : '')}
            required
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
          <select
            value={idCategoria}
            onChange={(e) => setIdCategoria(Number(e.target.value))}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.nombre} ({cat.tipo})
              </option>
            ))}
          </select>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Guardar Transacción
          </button>
        </form>
      </div>

      {/* Lista de Transacciones */}
      <h3>Historial de Movimientos</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Fecha</th>
            <th style={{ padding: '8px' }}>Categoría</th>
            <th style={{ padding: '8px' }}>Descripción</th>
            <th style={{ padding: '8px' }}>Monto</th>
            <th style={{ padding: '8px' }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {transacciones.map((t) => (
            <tr key={t.idTransaccion} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{t.fecha}</td>
              <td style={{ padding: '8px' }}>{t.categoria?.nombre}</td>
              <td style={{ padding: '8px' }}>{t.descripcion || '-'}</td>
              <td style={{ padding: '8px', color: t.categoria?.tipo === 'INGRESO' ? 'green' : 'red', fontWeight: 'bold' }}>
                {t.categoria?.tipo === 'INGRESO' ? '+' : '-'}${t.monto.toLocaleString()}
              </td>
              <td style={{ padding: '8px' }}>
                <button
                  onClick={() => handleEliminar(t.idTransaccion)}
                  style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {transacciones.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '15px' }}>
                No hay transacciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};