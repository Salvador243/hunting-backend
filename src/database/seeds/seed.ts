import { DataSource } from 'typeorm';
import { seedAdminUser } from './admin-user.seed';

async function runSeeds() {
  // Crear conexión a la base de datos
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'hunting_db',
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('📦 Database connected');

    // Ejecutar seeds
    await seedAdminUser(dataSource);

    console.log('✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds();
