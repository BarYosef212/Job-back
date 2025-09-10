import express from 'express';
import { Request, Response } from 'express';
import { Job, IJob } from '../models/Job';
import { logger } from '../utils/logger';
import * as jobController from '../controllers/job';

const router = express.Router();

router.get('/', jobController.getAllJobs);
router.get('/scan-jobs', jobController.scanJobs);
router.get('/scanning-status', jobController.getScanningStatus);

export { router as jobRoutes };