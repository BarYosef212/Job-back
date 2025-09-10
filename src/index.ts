import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { getGeneral } from './services/general';
import { jobRoutes } from './routes/jobRoutes';
import { websiteRoutes } from './routes/websiteRoutes';
import { generalRoutes } from './routes/general';
import { logger } from './utils/logger';
import { scanJobs } from './services/job';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/general', generalRoutes);

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}


let currentInterval = 0;
let job: any = null;

async function startCronJob() {
  const settings = await getGeneral();
  if (!settings) return;

  if (settings.interval !== currentInterval) {
    if (job) job.stop();

    currentInterval = settings.interval as number;
    const cronExpression = `*/${currentInterval} * * * *`;
    job = cron.schedule(cronExpression, () => {
      logger.info('Running scheduled job scan...');
      scanJobs();
    });
    logger.info(`Cron job scheduled every ${currentInterval} minutes`);
  }
}

setInterval(startCronJob, 60 * 1000);

app.listen(PORT, async () => {
  await connectToMongoDB();
  await startCronJob();
  logger.info(`Server running on port ${PORT}`);
});


export default app;
