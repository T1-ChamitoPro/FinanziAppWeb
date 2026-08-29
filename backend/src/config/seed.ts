import { prisma } from './database';

export type TipoTransaccion = 'INGRESO' | 'GASTO';

export const categoriasIniciales: { nombre: string; tipo: TipoTransaccion }[] = [
  // Ingresos
  { nombre: 'Salario', tipo: 'INGRESO' },
  { nombre: 'Ventas', tipo: 'INGRESO' },
  { nombre: 'Inversiones', tipo: 'INGRESO' },
  { nombre: 'Otros Ingresos', tipo: 'INGRESO' },

  // Gastos
  { nombre: 'Alimentación', tipo: 'GASTO' },
  { nombre: 'Vivienda / Arriendo', tipo: 'GASTO' },
  { nombre: 'Servicios Públicos', tipo: 'GASTO' },
  { nombre: 'Transporte', tipo: 'GASTO' },
  { nombre: 'Entretenimiento', tipo: 'GASTO' },
  { nombre: 'Salud', tipo: 'GASTO' },
  { nombre: 'Educación', tipo: 'GASTO' },
  { nombre: 'Otros Gastos', tipo: 'GASTO' },
];

export async function seedCategorias() {
  const count = await prisma.categoria.count();
  if (count === 0) {
    await prisma.categoria.createMany({
      data: categoriasIniciales,
    });
    console.log('>>> Categorías por defecto inicializadas con éxito.');
  }
}

async function main() {
  await seedCategorias();
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
