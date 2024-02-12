import { prisma } from './db.js';

export async function getTollPriceForDateTime(dateTime) {
  const searchDateTime = new Date(dateTime);
  const searchDate = searchDateTime.toISOString().split('T')[0];
  // Extracts the time part in 'HH:MM' format
  const searchTime = searchDateTime
    .toTimeString()
    .split(' ')[0]
    .substring(0, 5);

  try {
    const tollPrice = await prisma.tollPrice.findFirst({
      where: {
        valid_until: {
          gte: new Date(searchDate).toISOString(),
        },
        AND: [
          {
            from: {
              lte: searchTime,
            },
          },
          {
            until: {
              gte: searchTime,
            },
          },
        ],
      },
      orderBy: {
        valid_until: 'asc',
      },
    });

    if (tollPrice) {
      return tollPrice;
    } else {
      return {
        price: 0,
      };
    }
  } catch (error) {
    console.error(
      'Error fetching the Toll Price for the given DateTime:',
      error
    );
    return null;
  }
}
