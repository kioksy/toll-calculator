import { Router } from 'express';
import { getLatestTotalDailyPriceForDate } from '../db/total_daily_price.js';
const router = Router();

/**
 * Get toll price for given DateTime
 */
router.get('/', async (req, res) => {
  const tollDailyTotalPrice = await getLatestTotalDailyPriceForDate();
  if (tollDailyTotalPrice) {
    return res.status(200).json(tollDailyTotalPrice);
  }
  return res.status(404).json({ error: 'Not found' });
});

export default router;
