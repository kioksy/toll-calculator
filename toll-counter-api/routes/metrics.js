import { Router } from 'express';
import {
  getTotalVehiclesForDate,
  getGroupedVehiclesForDate,
  getTotalRegisteredPriceForDate,
  getTotalLogEntriesForDate,
  getGroupCountedTollLogReasonsForDate,
} from '../db/metrics.js';

const router = Router();

/**
 * Get toll price for given DateTime
 */
router.get('/total_vehicles', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'date is a required parameter' });
  }

  const totalVehicles = await getTotalVehiclesForDate(date);

  if (totalVehicles) {
    return res.status(200).json(totalVehicles);
  }
  return res.status(500).json({ error: 'something went wrong' });
});

router.get('/grouped_vehicles', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'date is a required parameter' });
  }

  const groupedVehicles = await getGroupedVehiclesForDate(date);

  if (groupedVehicles) {
    return res.status(200).json(groupedVehicles);
  }
  return res.status(500).json({ error: 'something went wrong' });
});

router.get('/total_registered_price', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'date is a required parameter' });
  }

  const totalRegisteredPrice = await getTotalRegisteredPriceForDate(date);

  if (totalRegisteredPrice) {
    return res.status(200).json(totalRegisteredPrice);
  }
  return res.status(500).json({ error: 'something went wrong' });
});

router.get('/total_log_entries', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'date is a required parameter' });
  }

  const totalLogEntries = await getTotalLogEntriesForDate(date);

  if (totalLogEntries) {
    return res.status(200).json(totalLogEntries);
  }
  return res.status(500).json({ error: 'something went wrong' });
});

router.get('/grouped_log_entries', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'date is a required parameter' });
  }

  const groupedLogEntriesReasons = await getGroupCountedTollLogReasonsForDate(
    date
  );

  if (groupedLogEntriesReasons) {
    return res.status(200).json(groupedLogEntriesReasons);
  }
  return res.status(500).json({ error: 'something went wrong' });
});

export default router;
