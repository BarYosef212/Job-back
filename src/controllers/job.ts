import { Request, Response } from 'express';
import { Job, IJob } from '../models/Job';
import { Website, IWebsite } from '../models/Website';
import { logger } from '../utils/logger';
import * as jobService from '../services/job';

// Global scanning state
let isScanning = false;

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
  if (isScanning) {
    return res.status(409).json({ error: 'Scan is already in progress' });
  }

  try {
    isScanning = true;
    await jobService.scanJobs();
    logger.info('Jobs scanned successfully');
    return res.status(200).json({ message: 'Jobs scanned successfully' });
  } catch (error) {
    logger.error('Error scanning jobs:', error);
    return res.status(500).json({ error: 'Failed to scan jobs' });
  } finally {
    isScanning = false;
  }
};

export const getScanningStatus = async (req: Request, res: Response): Promise<Response> => {
  const cronScanning = jobService.isScanningInProgress();
  return res.status(200).json({ isScanning: isScanning || cronScanning });
};