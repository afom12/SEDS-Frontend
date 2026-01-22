// Seed script for development
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@seds.com' },
    update: {},
    create: {
      email: 'admin@seds.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      verified: true,
      verifiedAt: new Date(),
    },
  });

  // Create donor user
  const donorPassword = await bcrypt.hash('donor123', 12);
  const donor = await prisma.user.upsert({
    where: { email: 'donor@seds.com' },
    update: {},
    create: {
      email: 'donor@seds.com',
      password: donorPassword,
      name: 'John Donor',
      role: 'DONOR',
      verified: true,
      verifiedAt: new Date(),
    },
  });

  // Create receiver user
  const receiverPassword = await bcrypt.hash('receiver123', 12);
  const receiver = await prisma.user.upsert({
    where: { email: 'receiver@seds.com' },
    update: {},
    create: {
      email: 'receiver@seds.com',
      password: receiverPassword,
      name: 'Jane Receiver',
      role: 'RECEIVER',
      verified: false,
    },
  });

  console.log('✅ Seed completed!');
  console.log('Admin:', admin.email);
  console.log('Donor:', donor.email);
  console.log('Receiver:', receiver.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

