import { prisma } from './db.js';

/**
 * Get total daily price for given date
 * @param {*} date
 * @returns
 */
export async function getLatestTotalDailyPriceForDate() {
  try {
    const latestTotalDailyPrice = await prisma.totalDailyPrice.findFirst({
      orderBy: {
        from: 'desc',
      },
    });
    if (latestTotalDailyPrice) {
      return latestTotalDailyPrice;
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      'Error fetching the latest Total Daily Price for the given date:',
      error
    );
    return null;
  }
}
