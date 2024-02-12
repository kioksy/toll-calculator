import { Router } from 'express';
import {
  addTollRegistrationLogEntry,
  findTollRegistrationsForGivenDay,
} from '../db/toll_registration_log.js';
const router = Router();

router.get('/', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'date is a required params' });
  }
  const tollLogForGivenDate = await findTollRegistrationsForGivenDay(date);
  if (tollLogForGivenDate) {
    return res.status(200).json(tollLogForGivenDate);
  }
  return res.status(404).json({ error: 'Not Found' });
});

/**
 * Get toll price for given DateTime
 */
router.post('/', async (req, res) => {
  const { regNr, vehicleTypeName, date } = req.body;
  if (!regNr || !vehicleTypeName || !date) {
    return res
      .status(400)
      .json({ error: 'regNr, vehicleTypeName and date are required params' });
  }
  const tollRegistration = await addTollRegistrationLogEntry(
    regNr,
    vehicleTypeName,
    date
  );
  if (tollRegistration) {
    return res.status(200).json(tollRegistration);
  }
  return res.status(500).json({ error: 'could not register toll' });
});

export default router;
