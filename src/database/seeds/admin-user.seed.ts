import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums/role.enum';

export async function seedAdminUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository('User');

  // Verificar si ya existe un admin
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@hunting.com' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('temporal', 10);
  
  const adminUser = userRepository.create({
    email: 'admin@hunting.com',
    password: hashedPassword,
    role: Role.ADMIN,
  });

  await userRepository.save(adminUser);
  
  console.log('✅ Admin user created successfully!');
  console.log('Email: admin@hunting.com');
  console.log('Password: temporal');
}
