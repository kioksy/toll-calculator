// Import the PrismaClient instance using ESM syntax
import { prisma } from './db.js';
import { addTollRegistrationLogEntry } from './toll_registration_log.js';

export async function initDB() {
  // First clear all tables
  console.log('Init DB');
  await prisma.tollRegistrationLog.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.vehicleType.deleteMany({});
  await prisma.tollPrice.deleteMany({});
  await prisma.totalDailyPrice.deleteMany({});
  await prisma.holiday.deleteMany({});

  // Array of vehicle types to be inserted
  console.log('Setting vehicle types');
  const vehicleTypes = [
    { name: 'MOTORBIKE', has_pricing: false },
    { name: 'TRACTOR', has_pricing: false },
    { name: 'EMERGENCY', has_pricing: false },
    { name: 'DIPLOMAT', has_pricing: false },
    { name: 'FOREIGN', has_pricing: false },
    { name: 'MILITARY', has_pricing: false },
    { name: 'TRUCK', has_pricing: true },
    { name: 'CAR', has_pricing: true },
  ];

  // Loop through the vehicleTypes array and insert each vehicle type
  for (const vehicleType of vehicleTypes) {
    await prisma.vehicleType.upsert({
      where: { name: vehicleType.name },
      update: {},
      create: {
        name: vehicleType.name,
        has_pricing: vehicleType.has_pricing,
      },
    });
  }

  // in prodction we would have used a real api to fetch holidays from
  console.log('Adding holidays for 2024');
  const holidays2024 = [
    '2024-01-01T00:00:00',
    '2024-01-06T00:00:00',
    '2024-03-29T00:00:00',
    '2024-04-01T00:00:00',
    '2024-05-01T00:00:00',
    '2024-05-09T00:00:00',
    '2024-05-18T00:00:00',
    '2024-05-19T00:00:00',
    '2024-06-06T00:00:00',
    '2024-06-21T00:00:00',
    '2024-06-22T00:00:00',
    '2024-11-02T00:00:00',
    '2024-12-24T00:00:00',
    '2024-12-25T00:00:00',
    '2025-12-26T00:00:00',
    '2024-12-31T00:00:00',
  ];

  // add all public holidays for 2024
  for (const date in holidays2024) {
    await prisma.holiday.upsert({
      where: { date: new Date(holidays2024[date]).toISOString() },
      update: {},
      create: {
        date: new Date(holidays2024[date]).toISOString(),
      },
    });
  }

  // Set total daily price for initial year
  console.log('Setting total daily price for 2024');
  await prisma.totalDailyPrice.upsert({
    where: { name: '2024' },
    update: {},
    create: {
      name: '2024',
      price: 60,
      from: new Date('2024-01-01T00:00:00').toISOString(),
      until: new Date('2014-12-31T23:59:59').toISOString(),
    },
  });

  // add toll prices for 2024, all future prices would be added from an UI
  console.log('Adding toll prices for given hours');
  const tollPrices2024 = [
    {
      id: 1,
      from: '06:00',
      until: '06:29',
      price: 8,
      valid_until: '2024-12-31T00:00:00',
    },
    {
      id: 2,
      from: '06:30',
      until: '06:59',
      price: 13,
      valid_until: '2024-12-31T00:00:00',
    },
    {
      id: 3,
      from: '07:00',
      until: '07:59',
      price: 18,
      valid_until: '2024-12-31T00:00:00',
    },
    {
      id: 4,
      from: '08:00',
      until: '08:29',
      price: 13,
      valid_until: '2024-12-31T00:00:00',
    },
    {
      id: 5,
      from: '08:30',
      until: '14:59',
      price: 8,
      valid_until: '2024-12-31T00:00:00',
    },
    {
      id: 6,
      from: '15:00',
      until: '15:29',
      price: 13,
      valid_until: '2024-12-31T00:00:00',
    },
    {
      id: 7,
      from: '15:30',
      until: '16:59',
      price: 18,
      valid_until: '2024-12-31T00:00:00',
    },
    {
      id: 8,
      from: '17:00',
      until: '17:59',
      price: 13,
      valid_until: '2024-12-31T00:00:00',
    },
    {
      id: 9,
      from: '18:00',
      until: '18:29',
      price: 8,
      valid_until: '2024-12-31T00:00:00',
    },
  ];
  for (const tollPrice of tollPrices2024) {
    await prisma.tollPrice.upsert({
      where: { id: tollPrice.id },
      update: {},
      create: {
        id: tollPrice.id,
        from: tollPrice.from,
        until: tollPrice.until,
        price: tollPrice.price,
        valid_until: new Date(tollPrice.valid_until).toISOString(),
      },
    });
  }

  // create 10 random vehicles
  console.log('Generating random vehicle data');
  const today = new Date();
  for (let i = 0; i < 8; i++) {
    let car = createRegNr();
    let vehicleType = vehicleTypes[i].name;
    // loop through 3 days
    for (let d = 2; d > 0; d--) {
      let daysAgo = d - 1;
      let logDate = new Date();
      logDate.setDate(today.getDate() - daysAgo);

      // loop through 06 - 19 hours and set random hours
      for (let t = 5; t < 14; t++) {
        for (let m = 0; m < 59; m++) {
          // add each 50 minutes of hour
          if (m % 20 === 0) {
            logDate.setHours(t, m, getRandomSecond());
            let logDateFormatted = logDate.toISOString().slice(0, 19);
            await addTollRegistrationLogEntry(
              car,
              vehicleType,
              logDateFormatted
            );
          }
        }
      }
    }
  }

  console.log('All Data Initialized');
}

function getRandomSecond() {
  return Math.floor(Math.random() * 60);
}

function createRegNr() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  // Generate first three characters (uppercase letters)
  for (let i = 0; i < 3; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Generate last three characters (numbers)
  for (let i = 0; i < 3; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return result;
}
