import React, { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/useAuth';
import { Navbar } from '../components/Navbar';
import { ModalCategoria } from '../components/ModalCategoria';
import { PresupuestoBarra } from '../components/PresupuestoBarra';
import { exportarACSV } from '../utils/exportCsv';
import {
  getBalanceUsuario,
  getTransaccionesUsuario,
  getCategorias,
  crearTransaccion,
  eliminarTransaccion,
} from '../services/finanziappService';
import type { BalanceResponse, Transaccion, Categoria } from '../services/finanziappService';
import { FinanceCharts } from '../components/FinanceCharts';

export const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recargarCategorias = async () => {
    try {
      const res = await getCategorias();
      setCategorias(res.data);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError('Error al refrescar categorias');
      }
    }
  };
  const { user } = useAuth();

  const [balance, setBalance] = useState<BalanceResponse>({
    totalIngresos: 0,
    totalGastos: 0,
    balanceTotal: 0,
  });
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Formulario
  const [monto, setMonto] = useState<number | ''>('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [idCategoria, setIdCategoria] = useState<number | ''>('');
  const [error, setError] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'INGRESO' | 'GASTO'>('TODOS');
  const [filtroCategoria, setFiltroCategoria] = useState<number | ''>('');

  const transaccionesFiltradas = transacciones.filter((t) => {
    const coincideTexto = t.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ?? true;
    const coincideTipo = filtroTipo === 'TODOS' || t.categoria?.tipo === filtroTipo;
    const coincideCategoria = filtroCategoria === '' || t.categoria?.idCategoria === Number(filtroCategoria);

    return coincideTexto && coincideTipo && coincideCategoria;
  });

  const ejecutarCarga = async () => {
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
        setError(err.response?.data?.error || 'Error al cargar los datos');
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const cargarInicial = async () => {
      if (!user) return;
      try {
        const [resBalance, resTransacciones, resCategorias] = await Promise.all([
          getBalanceUsuario(user.idUsuario),
          getTransaccionesUsuario(user.idUsuario),
          getCategorias(),
        ]);
        if (isMounted) {
          setBalance(resBalance.data);
          setTransacciones(resTransacciones.data);
          setCategorias(resCategorias.data);
        }
      } catch (err: unknown) {
        if (isMounted && isAxiosError(err)) {
          setError(err.response?.data?.error || 'Error al cargar los datos');
        }
      }
    };

    cargarInicial();

    return () => {
      isMounted = false;
    };
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

      setMonto('');
      setDescripcion('');
      setIdCategoria('');
      ejecutarCarga();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || 'Error al crear la transacción');
      }
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarTransaccion(id);
      ejecutarCarga();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || 'Error al eliminar');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Navbar />

      <main style={{ width: '100%', padding: '24px 32px', boxSizing: 'border-box' }}>
        {error && <div className="alert-error">{error}</div>}

        {/* FILA 1: TARJETAS DE BALANCE (3 Columnas de igual ancho) */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Ingresos Totales</span>
              <span style={{ color: 'var(--success)', background: 'rgba(78, 201, 176, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>+</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: '12px' }}>
              ${balance.totalIngresos.toLocaleString()}
            </p>
          </div>

          <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Gastos Totales</span>
              <span style={{ color: 'var(--danger)', background: 'rgba(241, 76, 76, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>-</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)', marginTop: '12px' }}>
              ${balance.totalGastos.toLocaleString()}
            </p>
          </div>

          <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Balance Disponible</span>
              <span style={{ color: 'var(--primary)', background: 'var(--primary-glow)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>NET</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: balance.balanceTotal >= 0 ? 'var(--primary)' : 'var(--danger)', marginTop: '12px' }}>
              ${balance.balanceTotal.toLocaleString()}
            </p>
          </div>
        </section>

        {/* FILA 2: BARRA DE PRESUPUESTO */}
        <div style={{ marginBottom: '24px' }}>
          <PresupuestoBarra transacciones={transacciones} />
        </div>

        {/* FILA 3: GRÁFICOS FINANCIEROS (Distribución 50% - 50%) */}
        <div style={{ marginBottom: '24px' }}>
          <FinanceCharts transacciones={transacciones} />
        </div>

        {/* FILA 4: OPERACIONES (350px Formulario / Resto de pantalla para la Tabla) */}
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Formulario */}
          <section style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: '#ffffff' }}>Nuevo Movimiento</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Monto</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value ? Number(e.target.value) : '')}
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>Categoría</label>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    + Nueva
                  </button>
                </div>
                <select
                  className="form-input"
                  value={idCategoria}
                  onChange={(e) => setIdCategoria(Number(e.target.value))}
                  required
                >
                  <option value="">Selecciona opción</option>
                  {categorias.map((cat) => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombre} ({cat.tipo})
                    </option>
                  ))}
                </select>
              </div>

              <ModalCategoria
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCategoriaCreada={recargarCategorias}
              />

              <div className="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  className="form-input"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Detalle (opcional)"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                Añadir Transacción
              </button>
            </form>
          </section>

          {/* Historial Extendido */}
          <section style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Historial Reciente</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Mostrando {transaccionesFiltradas.length} de {transacciones.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => exportarACSV(transaccionesFiltradas)}
                disabled={transaccionesFiltradas.length === 0}
                style={{
                  backgroundColor: 'var(--input-bg)',
                  color: transaccionesFiltradas.length === 0 ? 'var(--text-muted)' : 'var(--text-main)',
                  border: '1px solid var(--border)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius)',
                  cursor: transaccionesFiltradas.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                📥 Exportar CSV
              </button>
            </div>

            {/* Controles de Filtro */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 180px', gap: '12px', marginBottom: '20px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Buscar descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <select
                className="form-input"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as 'TODOS' | 'INGRESO' | 'GASTO')}
              >
                <option value="TODOS">Todos</option>
                <option value="INGRESO">Ingresos</option>
                <option value="GASTO">Gastos</option>
              </select>

              <select
                className="form-input"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Todas las cat.</option>
                {categorias.map((cat) => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabla Ancha */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fecha</th>
                    <th style={{ padding: '12px', fontSize: '0.75rem', textTransform: 'uppercase' }}>Categoría</th>
                    <th style={{ padding: '12px', fontSize: '0.75rem', textTransform: 'uppercase' }}>Descripción</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.75rem', textTransform: 'uppercase' }}>Monto</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {transaccionesFiltradas.map((t) => (
                    <tr key={t.idTransaccion} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>{t.fecha}</td>
                      <td style={{ padding: '14px 12px', fontWeight: 600, color: '#ffffff' }}>{t.categoria?.nombre}</td>
                      <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>{t.descripcion || '—'}</td>
                      <td style={{
                        padding: '14px 12px',
                        textAlign: 'right',
                        fontWeight: 700,
                        color: t.categoria?.tipo === 'INGRESO' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {t.categoria?.tipo === 'INGRESO' ? '+' : '-'}${t.monto.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEliminar(t.idTransaccion)}
                          style={{
                            background: 'transparent',
                            color: 'var(--danger)',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {transaccionesFiltradas.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                        No se encontraron coincidencias.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>

    </div>
  );
};