import { Router } from 'express';
import { getTollPriceForDateTime } from '../db/toll_price.js';
const router = Router();

/**
 * Get toll price for given DateTime
 */
router.get('/', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'date is a required parameter' });
  }
  const price = await getTollPriceForDateTime(date);
  if (price) {
    return res.status(200).json(price);
  }
  return res.status(404).json({ error: 'Not found' });
});

export default router;
