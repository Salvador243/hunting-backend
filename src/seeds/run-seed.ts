import { DataSource } from 'typeorm';
import { seedAdmin } from './admin.seed';

// Load env vars - dotenv is included via @nestjs/config
require('dotenv').config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'internship_platform',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
});

async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('Database connected');

    await seedAdmin(dataSource);

    console.log('Seeds completed successfully');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
}

runSeeds();
