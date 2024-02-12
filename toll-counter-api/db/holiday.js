import { prisma } from './db.js';

/**
 * Get all holidays
 * @returns list of holiday dates
 */
export async function getAllHolidays() {
  try {
    const holidays = await prisma.holiday.findMany();
    return holidays;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return null;
  }
}

/**
 * Get Holiday for given date
 * @param {*} date
 * @returns
 */
export async function isHoliday(date) {
  try {
    const holiday = await prisma.holiday.findUnique({
      where: {
        date: new Date(date),
      },
    });

    if (holiday) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error fetching holiday by date:', error);
    return false;
  }
}
