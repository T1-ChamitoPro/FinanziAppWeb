import app from './app';
import { ENV } from './config/env';
import { prisma } from './config/database';
import { seedCategorias } from './config/seed';

async function bootstrap() {
  try {
    // Intentar inicializar categorías si la BD está disponible
    await seedCategorias().catch((err) => {
      console.warn('⚠️ No se pudo inicializar categorías por defecto (la BD puede no estar conectada aún):', err.message);
    });

    const server = app.listen(ENV.PORT, () => {
      console.log(`===========================================`);
      console.log(`🚀 FinanziApp Backend (Node.js/Express)`);
      console.log(`📡 Servidor corriendo en http://localhost:${ENV.PORT}`);
      console.log(`⚙️  Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`===========================================`);
    });

    const handleShutdown = async () => {
      console.log('\n🛑 Cerrando servidor...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ Desconexión limpia de base de datos.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', handleShutdown);
    process.on('SIGINT', handleShutdown);
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

bootstrap();
