import { Router } from 'express';
import {
  getAllVehicles,
  getVehicleByRegNr,
  addNewVehicle,
} from '../db/vehicle.js';
const router = Router();

/**
 * Get all vehicles
 */
router.get('/', async (req, res) => {
  const vehicles = await getAllVehicles();
  if (vehicles) {
    return res.status(200).json(vehicles);
  }
  return res.status(404).json({ error: 'Vehicles not found' });
});

/**
 * Find vehicle
 * @param { id } string,
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const vehicle = await getVehicleByRegNr(id);
  if (vehicle) {
    return res.status(200).json(vehicle);
  }
  return res.status(404).json({ error: 'Vehicle not found' });
});

/**
 * Add new vehicle
 * @param { regNr } string,
 * @param { vehicleType } string,
 */
router.post('/', async (req, res) => {
  const { regNr, vehicleType } = req.body;
  if (!regNr || !vehicleType) {
    res
      .status(400)
      .json({ error: 'regNr and vehicleType are required parameters' });
  }
  const newVehicleID = await addNewVehicle(regNr, vehicleType);
  if (newVehicleID) {
    return res.status(200).json({ id: newVehicleID });
  }
  return res.status(500).json({ error: 'Something went wrong' });
});

export default router;
