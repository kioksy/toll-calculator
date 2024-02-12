import { prisma } from './db.js';

export async function getTotalVehiclesForDate(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59);
  const total = await prisma.$queryRaw`
    SELECT COUNT(DISTINCT "vehicleId")::integer FROM "toll_registration_logs"
    WHERE "registeredAt" >= ${startOfDay} AND "registeredAt" <= ${endOfDay};
  `;

  return {
    total: total[0].count, // Adjust based on the actual structure of the returned result
  };
}

export async function getGroupedVehiclesForDate(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59);
  const result = await prisma.$queryRaw`
    SELECT vt.id AS vehicleTypeId, vt.name AS vehicleTypeName, COUNT(DISTINCT v.id)::integer AS count
    FROM "toll_registration_logs" AS trl
    INNER JOIN "vehicles" AS v ON trl."vehicleId" = v.id
    INNER JOIN "vehicle_types" AS vt ON v."vehicleTypeId" = vt.id
    WHERE trl."registeredAt" >= ${startOfDay} AND trl."registeredAt" < ${endOfDay}
    GROUP BY vt.id, vt.name;
  `;
  return result;
}

export async function getTotalRegisteredPriceForDate(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59);
  const totalRegisteredPriceOnDate = await prisma.tollRegistrationLog.aggregate(
    {
      _sum: {
        regiteredPrice: true,
      },
      where: {
        registeredAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    }
  );
  return totalRegisteredPriceOnDate;
}

export async function getTotalLogEntriesForDate(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59);
  const totalLogEntriesOnDate = await prisma.tollRegistrationLog.count({
    where: {
      registeredAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });
  return { total: totalLogEntriesOnDate };
}

export async function getGroupCountedTollLogReasonsForDate(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59);
  const reasonCountsOnDate = await prisma.tollRegistrationLog.groupBy({
    by: ['registeredPriceReason'],
    where: {
      registeredAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    _count: true,
  });
  return reasonCountsOnDate;
}
