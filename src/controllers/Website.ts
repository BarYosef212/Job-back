import { Request, Response } from 'express';
import { Website, IWebsite } from '../models/Website';
import { logger } from '../utils/logger';

interface WebsiteBody {
  name: string;
  url: string;
  keywords: string[];
}

export const getAllWebsites = async (req: Request, res: Response): Promise<Response> => {
  try {
    const websites = await Website.find();
    return res.status(200).json(websites);
  } catch (error) {
    logger.error('Error getting all websites:', error);
    return res.status(500).json({ error: 'Failed to get all websites' });
  }
};

export const createWebsite = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, url, keywords } = req.body as WebsiteBody;
    const website = await Website.create({ name, url, isActive: true, keywords });
    return res.status(201).json(website);
  } catch (error) {
    logger.error('Error creating website:', error);
    return res.status(500).json({ error: 'Failed to create website' });
  }
};

export const createWebsites = async (req: Request, res: Response): Promise<Response> => {
  try {
    const websites = req.body.websites as WebsiteBody[];
    let failed = 0
    for (const website of websites) {
      const { name, url, keywords } = website;
      try {
        const web = await Website.create({ name, url, isActive: true, keywords });
      } catch (error) {
        failed++
        logger.error(`Error creating website ${failed}: `, name);
        continue
      }
    }
    return res.status(201).json('Websites created successfully');
  } catch (error) {
    logger.error('Error creating website:', error);
    return res.status(500).json({ error: 'Failed to create websites' });
  }
};

export const getWebsite = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const website = await Website.findById(id);
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    return res.status(200).json(website);
  } catch (error) {
    logger.error('Error getting website:', error);
    return res.status(500).json({ error: 'Failed to get website' });
  }
};

export const updateWebsite = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData = req.body as any;
    const website = await Website.findByIdAndUpdate(id, updateData, { new: true });
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    return res.status(200).json(website);
  } catch (error) {
    logger.error('Error updating website:', error);
    return res.status(500).json({ error: 'Failed to update website' });
  }
};

export const deleteWebsite = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const website = await Website.findByIdAndDelete(id);
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    return res.status(200).json({ message: 'Website deleted successfully' });
  } catch (error) {
    logger.error('Error deleting website:', error);
    return res.status(500).json({ error: 'Failed to delete website' });
  }
};

export const toggleWebsiteStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const website = await Website.findByIdAndUpdate(
      id,
      { $set: { isActive: { $not: '$isActive' } } },
      { new: true }
    );
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    return res.status(200).json(website);
  } catch (error) {
    logger.error('Error toggling website status:', error);
    return res.status(500).json({ error: 'Failed to toggle website status' });
  }
};

export const clearWebsiteErrors = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const website = await Website.findByIdAndUpdate(
      id,
      {
        $unset: {
          lastError: 1,
          lastErrorAt: 1
        },
        $set: {
          errorCount: 0
        }
      },
      { new: true }
    );
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    return res.status(200).json(website);
  } catch (error) {
    logger.error('Error clearing website errors:', error);
    return res.status(500).json({ error: 'Failed to clear website errors' });
  }
};