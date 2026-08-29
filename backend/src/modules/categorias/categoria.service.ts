import { prisma } from '../../config/database';
import { CrearCategoriaInput } from './categoria.schema';

export type TipoTransaccion = 'INGRESO' | 'GASTO';

export class CategoriaService {
  async obtenerTodas() {
    return prisma.categoria.findMany({
      orderBy: { idCategoria: 'asc' },
    });
  }

  async obtenerPorTipo(tipo: TipoTransaccion) {
    return prisma.categoria.findMany({
      where: { tipo },
      orderBy: { idCategoria: 'asc' },
    });
  }

  async crearCategoria(data: CrearCategoriaInput) {
    return prisma.categoria.create({
      data: {
        nombre: data.nombre,
        tipo: data.tipo,
      },
    });
  }
}

export const categoriaService = new CategoriaService();
