import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository('User');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hunting.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existingAdmin = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await userRepository.save({
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log('Admin user already exists');
  }
}
