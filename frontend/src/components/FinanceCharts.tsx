import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { Transaccion } from '../services/finanziappService';

interface FinanceChartsProps {
  transacciones: Transaccion[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export const FinanceCharts: React.FC<FinanceChartsProps> = ({ transacciones }) => {
  // 1. Agrupar gastos por categoría para el gráfico de pastel
  const gastosPorCategoria = transacciones
    .filter((t) => t.categoria?.tipo === 'GASTO')
    .reduce<Record<string, number>>((acc, t) => {
      const nombreCat = t.categoria?.nombre || 'Sin categoría';
      acc[nombreCat] = (acc[nombreCat] || 0) + Number(t.monto);
      return acc;
    }, {});

  const dataPie = Object.keys(gastosPorCategoria).map((nombre) => ({
    name: nombre,
    value: gastosPorCategoria[nombre],
  }));

  // 2. Calcular totales de Ingresos vs Gastos para el gráfico de barras
  const totalIngresos = transacciones
    .filter((t) => t.categoria?.tipo === 'INGRESO')
    .reduce((acc, t) => acc + Number(t.monto), 0);

  const totalGastos = transacciones
    .filter((t) => t.categoria?.tipo === 'GASTO')
    .reduce((acc, t) => acc + Number(t.monto), 0);

  const dataBar = [
    {
      name: 'Resumen',
      Ingresos: totalIngresos,
      Gastos: totalGastos,
    },
  ];

  if (transacciones.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        Agrega movimientos para visualizar tus gráficos financieros.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
      
      {/* Gráfico 1: Gastos por Categoría */}
      <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
          Gastos por Categoría
        </h4>
        {dataPie.length > 0 ? (
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataPie.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(value: unknown) => [`$${Number(value || 0).toLocaleString()}`, 'Gasto']}
                    contentStyle={{
                        backgroundColor: '#1e1e1e',
                        borderColor: '#3c3c3c',
                        borderRadius: '6px',
                        color: '#cccccc',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#ffffff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '40px' }}>
            No hay gastos registrados.
          </p>
        )}
      </div>

      {/* Gráfico 2: Ingresos vs Gastos */}
      <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
          Ingresos vs Gastos
        </h4>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataBar}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                    formatter={(value: unknown, name: unknown) => [`$${Number(value || 0).toLocaleString()}`, String(name)]}
                    contentStyle={{
                        backgroundColor: '#1e1e1e',
                        borderColor: '#3c3c3c',
                        borderRadius: '6px',
                        color: '#cccccc',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#ffffff' }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} // Oculta la franja blanca molesta al pasar el mouse
                />
              <Bar dataKey="Ingresos" fill="var(--success)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gastos" fill="var(--danger)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};