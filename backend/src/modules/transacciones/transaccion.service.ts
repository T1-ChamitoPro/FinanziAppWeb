import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { AppError } from '../../middlewares/errorHandler';
import { CrearTransaccionInput, ActualizarTransaccionInput } from './transaccion.schema';

export interface BalanceResponse {
  totalIngresos: number;
  totalGastos: number;
  balanceTotal: number;
}

export type TransaccionConCategoria = Prisma.TransaccionGetPayload<{
  include: { categoria: true };
}>;

export class TransaccionService {
  async registrarTransaccion(data: CrearTransaccionInput) {
    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario: BigInt(data.idUsuario) },
    });

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 400);
    }

    const categoria = await prisma.categoria.findUnique({
      where: { idCategoria: BigInt(data.idCategoria) },
    });

    if (!categoria) {
      throw new AppError('Categoría no encontrada', 400);
    }

    const fechaDate = new Date(`${data.fecha}T00:00:00.000Z`);

    const transaccion: TransaccionConCategoria = await prisma.transaccion.create({
      data: {
        monto: data.monto,
        descripcion: data.descripcion || null,
        fecha: fechaDate,
        idUsuario: BigInt(data.idUsuario),
        idCategoria: BigInt(data.idCategoria),
      },
      include: {
        categoria: true,
      },
    });

    return {
      idTransaccion: Number(transaccion.idTransaccion),
      monto: Number(transaccion.monto),
      descripcion: transaccion.descripcion,
      fecha: data.fecha,
      idUsuario: Number(transaccion.idUsuario),
      idCategoria: Number(transaccion.idCategoria),
      categoria: {
        idCategoria: Number(transaccion.categoria.idCategoria),
        nombre: transaccion.categoria.nombre,
        tipo: transaccion.categoria.tipo,
      },
    };
  }

  async obtenerPorUsuario(idUsuario: number) {
    const transacciones: TransaccionConCategoria[] = await prisma.transaccion.findMany({
      where: { idUsuario: BigInt(idUsuario) },
      orderBy: { fecha: 'desc' },
      include: {
        categoria: true,
      },
    });

    return transacciones.map((t: TransaccionConCategoria) => ({
      idTransaccion: Number(t.idTransaccion),
      monto: Number(t.monto),
      descripcion: t.descripcion,
      fecha: t.fecha.toISOString().split('T')[0],
      idUsuario: Number(t.idUsuario),
      idCategoria: Number(t.idCategoria),
      categoria: {
        idCategoria: Number(t.categoria.idCategoria),
        nombre: t.categoria.nombre,
        tipo: t.categoria.tipo,
      },
    }));
  }

  async obtenerBalance(idUsuario: number): Promise<BalanceResponse> {
    const ingresos = await prisma.transaccion.aggregate({
      _sum: { monto: true },
      where: {
        idUsuario: BigInt(idUsuario),
        categoria: { tipo: 'INGRESO' },
      },
    });

    const gastos = await prisma.transaccion.aggregate({
      _sum: { monto: true },
      where: {
        idUsuario: BigInt(idUsuario),
        categoria: { tipo: 'GASTO' },
      },
    });

    const totalIngresos = Number(ingresos._sum.monto || 0);
    const totalGastos = Number(gastos._sum.monto || 0);
    const balanceTotal = totalIngresos - totalGastos;

    return {
      totalIngresos,
      totalGastos,
      balanceTotal,
    };
  }

  async actualizarTransaccion(id: number, data: ActualizarTransaccionInput) {
    const transaccionExistente = await prisma.transaccion.findUnique({
      where: { idTransaccion: BigInt(id) },
    });

    if (!transaccionExistente) {
      throw new AppError(`Transacción no encontrada con ID: ${id}`, 400);
    }

    const categoria = await prisma.categoria.findUnique({
      where: { idCategoria: BigInt(data.idCategoria) },
    });

    if (!categoria) {
      throw new AppError('Categoría no encontrada', 400);
    }

    const fechaDate = new Date(`${data.fecha}T00:00:00.000Z`);

    const actualizada: TransaccionConCategoria = await prisma.transaccion.update({
      where: { idTransaccion: BigInt(id) },
      data: {
        monto: data.monto,
        descripcion: data.descripcion || null,
        fecha: fechaDate,
        idCategoria: BigInt(data.idCategoria),
      },
      include: {
        categoria: true,
      },
    });

    return {
      idTransaccion: Number(actualizada.idTransaccion),
      monto: Number(actualizada.monto),
      descripcion: actualizada.descripcion,
      fecha: data.fecha,
      idUsuario: Number(actualizada.idUsuario),
      idCategoria: Number(actualizada.idCategoria),
      categoria: {
        idCategoria: Number(actualizada.categoria.idCategoria),
        nombre: actualizada.categoria.nombre,
        tipo: actualizada.categoria.tipo,
      },
    };
  }

  async eliminarTransaccion(id: number): Promise<void> {
    const transaccion = await prisma.transaccion.findUnique({
      where: { idTransaccion: BigInt(id) },
    });

    if (!transaccion) {
      throw new AppError('La transacción no existe', 400);
    }

    await prisma.transaccion.delete({
      where: { idTransaccion: BigInt(id) },
    });
  }
}

export const transaccionService = new TransaccionService();
