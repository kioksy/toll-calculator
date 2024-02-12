import { prisma } from './db.js';
import { getVehicleByRegNr, addNewVehicle } from './vehicle.js';
import { getTollPriceForDateTime } from './toll_price.js';
import { isHoliday } from './holiday.js';
import { getLatestTotalDailyPriceForDate } from './total_daily_price.js';

export async function findTollRegistrationsForGivenDay(date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59);
    const registrations = await prisma.tollRegistrationLog.findMany({
      where: {
        registeredAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        Vehicle: {
          include: {
            VehicleType: true,
          },
        },
      },
      orderBy: {
        registeredAt: 'desc',
      },
    });

    if (registrations) {
      const transformedRegistrations = registrations.map((registration) => ({
        id: registration.id,
        vehicleId: registration.vehicleId,
        regNr: registration.Vehicle.regNr,
        vehicleTypeId: registration.Vehicle.vehicleTypeId,
        vehicleTypeName: registration.Vehicle.VehicleType.name,
        registeredAt: registration.registeredAt,
        regiteredPrice: registration.regiteredPrice,
        registeredPriceReason: registration.registeredPriceReason,
      }));
      return transformedRegistrations;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function findTollRegistrationsForGivenDayAndRegNr(regNr, date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59);
    const registrations = await prisma.tollRegistrationLog.findMany({
      where: {
        AND: [
          {
            Vehicle: {
              regNr: regNr, // Filter by Vehicle's registration number
            },
          },
          {
            registeredAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        ],
      },
      include: {
        Vehicle: {
          include: {
            VehicleType: true,
          },
        },
      },
      orderBy: {
        registeredAt: 'desc',
      },
    });

    if (registrations) {
      const transformedRegistrations = registrations.map((registration) => ({
        id: registration.id,
        vehicleId: registration.vehicleId,
        regNr: registration.Vehicle.regNr,
        vehicleTypeId: registration.Vehicle.vehicleTypeId,
        vehicleTypeName: registration.Vehicle.VehicleType.name,
        registeredAt: registration.registeredAt,
        regiteredPrice: registration.regiteredPrice,
        registeredPriceReason: registration.registeredPriceReason,
      }));
      return transformedRegistrations;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function addTollRegistrationLogEntry(
  regNr,
  vehicleTypeName,
  date
) {
  try {
    // Step 1: Find the Vehicle ID
    let vehicle = await getVehicleByRegNr(regNr);

    if (!vehicle) {
      // Register new vehicle if not exist
      vehicle = await addNewVehicle(regNr, vehicleTypeName);
    }

    const vehicleId = vehicle.id;

    const tollPrice = await calculateTollPrice(vehicle, date);

    // Step 2: Create the TollRegistrationLog entry
    const tollRegistrationLog = await prisma.tollRegistrationLog.create({
      data: {
        vehicleId: vehicleId,
        registeredAt: new Date(date).toISOString(),
        regiteredPrice: tollPrice.price,
        registeredPriceReason: tollPrice.reason,
      },
    });

    return tollRegistrationLog;
  } catch (error) {
    console.error('Error adding Toll Registration Log entry:', error);
    return null;
  }
}

async function calculateTollPrice(vehicle, dateTime) {
  try {
    const regNr = vehicle.regNr;
    const currentDate = new Date(dateTime);

    // 1. Check if Vehicle is billable
    if (!vehicle.VehicleType.has_pricing) {
      return {
        price: 0,
        reason: 'FREE_VEHICLE_TYPE',
      };
    }

    // 2. Check if the Current Date is a Holiday or weekend
    const isDateHoliday = await isHoliday(dateTime);
    // 0 = Sunday, 6 = Saturday
    const currentDay = currentDate.getDay();
    const isWeekend = currentDay === 0 || currentDay === 6;
    // 6 = July, Free month    const currentMonth = currentDate.getMonth();
    const currentMonth = currentDate.getMonth();
    const isFreeMonth = currentMonth === 6;

    if (isDateHoliday || isWeekend || isFreeMonth) {
      let reason;
      if (isDateHoliday) {
        reason = 'HOLIDAY';
      }
      if (isFreeMonth) {
        reason = 'FREE_MONTH';
      }
      if (isWeekend) {
        reason = 'WEEKEND';
      }
      return {
        price: 0,
        reason: reason,
      };
    }

    // 3. Check if time is outside billing hours
    const tollPriceForGivenDateTime = await getTollPriceForDateTime(dateTime);
    if (tollPriceForGivenDateTime) {
      if (tollPriceForGivenDateTime.price === 0) {
        return {
          price: 0,
          reason: 'OUTSIDE_BILLING_HOURS',
        };
      }
    }

    const tollLogForGivenDate = await findTollRegistrationsForGivenDayAndRegNr(
      regNr,
      dateTime
    );

    if (tollLogForGivenDate) {
      // 4. Check the Last Toll Registration for the Vehicle

      // Get last registered toll log for given date
      const lastTollRegistration = tollLogForGivenDate.find(
        (tolLogg) => tolLogg.registeredPriceReason === 'NEW_TICKET'
      );
      if (lastTollRegistration) {
        const lastRegisteredTime = new Date(lastTollRegistration.registeredAt);
        const timeDifference = currentDate - lastRegisteredTime;

        // check if last row is within 60 minutes and must be specific ticket type
        if (timeDifference <= 60 * 60 * 1000) {
          return {
            price: 0,
            reason: 'TICKET_EXISTS',
          };
        }
      }

      // 5. Check if Sum is greater than total sum for the day or add difference
      const totalDailyPriceForDate = await getLatestTotalDailyPriceForDate();
      const totalDailyPrice = totalDailyPriceForDate?.price;
      const totalSumForDate = tollLogForGivenDate.reduce(
        (last, current) => last + current.regiteredPrice,
        0
      );
      // Max daily price reached
      if (totalSumForDate === totalDailyPrice) {
        return {
          price: 0,
          reason: 'MAX_DAILY_BILL',
        };
      }
      // Count diff for last remaining total daily price
      if (tollPriceForGivenDateTime.price + totalSumForDate > totalDailyPrice) {
        return {
          price: totalDailyPrice - totalSumForDate,
          reason: 'LAST_TICKET_TODAY',
        };
      }
    }

    // 6 . If nothing above, it's a new ticket and full price
    return {
      price: tollPriceForGivenDateTime.price,
      reason: 'NEW_TICKET',
    };
  } catch (error) {
    console.error('Error calculating toll price:', error);
    return null;
  }
}
