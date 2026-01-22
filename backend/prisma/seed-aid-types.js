// Seed script for Aid Types
// Run this after creating the AidType model

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const aidTypes = [
  {
    code: 'FOOD_URGENT',
    name: 'Urgent Food (Perishable)',
    nameAmharic: 'አስቸኳይ ምግብ (በፍጥነት የሚበላሽ)',
    description: 'Perishable food items that need immediate distribution',
    category: 'FOOD',
    isPerishable: true,
    requiresExpiration: true,
    allowsScheduling: false,
    requiresQuantity: true,
    defaultUrgency: 'URGENT',
    displayOrder: 1,
  },
  {
    code: 'FOOD_CEREMONY',
    name: 'Food for Ceremony/Event',
    nameAmharic: 'ለስነ-ስርዓት/ዝግጅት ምግብ',
    description: 'Food needed for ceremonies, events, or scheduled occasions',
    category: 'FOOD',
    isPerishable: false,
    requiresExpiration: false,
    allowsScheduling: true,
    requiresQuantity: true,
    defaultUrgency: 'MEDIUM',
    displayOrder: 2,
  },
  {
    code: 'CLOTHING',
    name: 'Clothing',
    nameAmharic: 'ልብስ',
    description: 'Clothing items - shirts, pants, shoes, etc.',
    category: 'CLOTHING',
    isPerishable: false,
    requiresExpiration: false,
    allowsScheduling: true,
    requiresQuantity: true,
    defaultUrgency: 'MEDIUM',
    displayOrder: 3,
  },
  {
    code: 'MEDICAL',
    name: 'Medical Assistance',
    nameAmharic: 'የጤና እርዳታ',
    description: 'Medical supplies, medicine, or medical services',
    category: 'MEDICAL',
    isPerishable: false,
    requiresExpiration: false,
    allowsScheduling: true,
    requiresQuantity: true,
    defaultUrgency: 'HIGH',
    displayOrder: 4,
  },
  {
    code: 'CASH',
    name: 'Cash Support',
    nameAmharic: 'ገንዘብ እርዳታ',
    description: 'Cash support when physical aid is not possible',
    category: 'CASH',
    isPerishable: false,
    requiresExpiration: false,
    allowsScheduling: true,
    requiresQuantity: false,
    defaultUrgency: 'MEDIUM',
    displayOrder: 5,
  },
  {
    code: 'EDUCATION',
    name: 'School Supplies',
    nameAmharic: 'የትምህርት እቃዎች',
    description: 'Books, school supplies, uniforms, etc.',
    category: 'EDUCATION',
    isPerishable: false,
    requiresExpiration: false,
    allowsScheduling: true,
    requiresQuantity: true,
    defaultUrgency: 'MEDIUM',
    displayOrder: 6,
  },
  {
    code: 'SHELTER',
    name: 'Housing/Shelter Support',
    nameAmharic: 'የመኖሪያ/መጠለያ እርዳታ',
    description: 'Temporary shelter, rent assistance, or housing materials',
    category: 'SHELTER',
    isPerishable: false,
    requiresExpiration: false,
    allowsScheduling: true,
    requiresQuantity: false,
    defaultUrgency: 'HIGH',
    displayOrder: 7,
  },
  {
    code: 'SERVICES',
    name: 'Services',
    nameAmharic: 'አገልግሎቶች',
    description: 'Transportation, labor, professional services',
    category: 'SERVICES',
    isPerishable: false,
    requiresExpiration: false,
    allowsScheduling: true,
    requiresQuantity: false,
    defaultUrgency: 'MEDIUM',
    displayOrder: 8,
  },
  {
    code: 'OTHER',
    name: 'Other',
    nameAmharic: 'ሌላ',
    description: 'Other types of aid - custom description required',
    category: 'OTHER',
    isPerishable: false,
    requiresExpiration: false,
    allowsScheduling: true,
    requiresQuantity: false,
    defaultUrgency: 'MEDIUM',
    displayOrder: 9,
  },
];

async function main() {
  console.log('🌱 Seeding Aid Types...');

  for (const aidType of aidTypes) {
    await prisma.aidType.upsert({
      where: { code: aidType.code },
      update: {},
      create: aidType,
    });
  }

  console.log('✅ Aid Types seeded successfully!');
  console.log(`   Created ${aidTypes.length} aid types`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

