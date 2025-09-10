import { Request, Response } from 'express';
import { Job, IJob } from '../models/Job';
import { Website, IWebsite } from '../models/Website';
import { logger } from '../utils/logger';
import * as jobService from '../services/job';

export const getAllJobs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const jobs = await Job.find().populate('websiteId', 'name url');
    return res.status(200).json(jobs);
  } catch (error) {
    logger.error('Error getting all jobs:', error);
    return res.status(500).json({ error: 'Failed to get all jobs' });
  }
};


export const scanJobs = async (req: Request, res: Response): Promise<Response> => {
  try {
    await jobService.scanJobs();
    return res.status(200).json({ message: 'Jobs scanned successfully' });
  } catch (error) {
    logger.error('Error scanning jobs:', error);
    return res.status(500).json({ error: 'Failed to scan jobs' });
  }
};