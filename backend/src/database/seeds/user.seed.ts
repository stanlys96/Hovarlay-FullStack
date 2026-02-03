import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/user.entity';
import { generateSecurePassword } from '../../utils/utils';

export async function seedUsers(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const SALT_ROUNDS = 10;

  const firstNames = [
    'John', 'Michael', 'David', 'James', 'Robert', 'Daniel', 'William',
    'Andrew', 'Joseph', 'Matthew', 'Anthony', 'Christopher', 'Joshua',
    'Emily', 'Sarah', 'Jessica', 'Ashley', 'Amanda', 'Emma', 'Olivia',
    'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Ava',
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Thomas',
    'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia',
    'Martinez', 'Lee', 'Perez', 'Clark', 'Lewis', 'Walker', 'Hall',
    'Young', 'Allen', 'King', 'Wright', 'Scott', 'Green',
  ];

  const users: User[] = [];

  for (let i = 1; i <= 1000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    const randomPassword = generateSecurePassword(15);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    const hashedPassword = await bcrypt.hash(randomPassword, SALT_ROUNDS);

    const user = userRepo.create({
      email,
      password: hashedPassword,
      name: fullName,
      method: "email",
    });

    users.push(user);
  }

  await userRepo.save(users, { chunk: 100 });
  console.log('✅ Seeded 1000 users with random names');
}
