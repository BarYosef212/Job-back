import { Request, Response } from 'express';
import { Website, IWebsite } from '../models/Website';
import { logger } from '../utils/logger';

interface WebsiteBody {
  name: string;
  url: string;
  keywords: string[];
}

export const getAllWebsites = async (req: Request, res: Response):Promise<Response> => {
  try {
    const websites = await Website.find();
    return res.status(200).json(websites);
  } catch (error) {
    logger.error('Error getting all websites:', error);
    return res.status(500).json({ error: 'Failed to get all websites' });
  }
};

export const createWebsite = async (req: Request, res: Response):Promise<Response> => {
  try {
    const { name, url, keywords } = req.body as WebsiteBody;
    const website = await Website.create({ name, url, isActive: true, keywords });
    return res.status(201).json(website);
  } catch (error) {
    logger.error('Error creating website:', error);
    return res.status(500).json({ error: 'Failed to create website' });
  }
};