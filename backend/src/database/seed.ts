import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';
import { seedProducts } from './seeds/product.seed';
import { seedUsers } from './seeds/user.seed';

const dataSource = new DataSource(dataSourceOptions);

async function run() {
  await dataSource.initialize();
  console.log('🌱 Database connected');

  await seedProducts(dataSource);
  await seedUsers(dataSource);

  await dataSource.destroy();
  console.log('🌱 Seeding finished');
}

run().catch((err) => {
  console.error('❌ Seeding failed', err);
  process.exit(1);
});
