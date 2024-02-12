import express from 'express';
import cors from 'cors';
import { initDB } from './db/init_db.js';

import vehicleRouter from './routes/vehicle.js';
import tollPriceRouter from './routes/toll_price.js';
import tollRegistrationRouter from './routes/toll_registration_log.js';
import tollTotalDailyPriceRouter from './routes/toll_total_daily_price.js';
import metricsRouter from './routes/metrics.js';

try {
  const app = express();

  app.use(
    cors({
      origin: '*',
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use('/vehicles', vehicleRouter);
  app.use('/toll_prices', tollPriceRouter);
  app.use('/toll_registration_log', tollRegistrationRouter);
  app.use('/toll_total_daily_price', tollTotalDailyPriceRouter);
  app.use('/analytics', metricsRouter);

  app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is up at port: ${process.env.EXPRESS_PORT}`);
    initDB();
  });
} catch (error) {
  console.error(error);
}
