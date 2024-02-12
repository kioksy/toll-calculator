import { prisma } from './db.js';

/**
 * Get vehicleTypeID from name
 * @param {*} vehicleTypeName
 * @returns
 */
export async function getVehicleTypeIdByName(vehicleTypeName) {
  const vehicleType = await prisma.vehicleType.findUnique({
    where: {
      name: vehicleTypeName,
    },
  });
  return vehicleType ? vehicleType.id : null;
}

/**
 * Get vehcicle by regNr
 * @param {*} regNr
 * @returns
 */
export async function getVehicleByRegNr(regNr) {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      regNr: regNr,
    },
    include: {
      VehicleType: true,
      tollRegistrationLogs: {
        orderBy: {
          registeredAt: 'desc',
        },
      },
    },
  });

  return vehicle ? vehicle : null;
}

/**
 * Get all vehicles
 * @returns
 */
export async function getAllVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      VehicleType: true,
    },
  });
  return vehicles ? vehicles : [];
}

/**
 * Add new Vehicle
 * @param {*} regNr
 * @param {*} vehicleTypeName
 * @returns
 */
export async function addNewVehicle(regNr, vehicleTypeName) {
  const vehicleTypeId = await getVehicleTypeIdByName(vehicleTypeName);

  if (vehicleTypeId === null) {
    return;
  }

  const newVehicle = await prisma.vehicle.upsert({
    where: { regNr: regNr },
    create: {
      vehicleTypeId: vehicleTypeId,
      regNr: regNr,
    },
    update: {},
    include: {
      VehicleType: true,
    },
  });

  return newVehicle;
}
