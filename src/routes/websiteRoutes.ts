import express from 'express';
import { Request, Response } from 'express';
import { Website, IWebsite } from '../models/Website';
import { logger } from '../utils/logger';

const router = express.Router();

// GET /api/websites - Get all websites with optional filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, isActive } = req.query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const websites = await Website.find(filter).sort({ createdAt: -1 });
    res.json(websites);
  } catch (error) {
    logger.error('Error fetching websites:', error);
    res.status(500).json({ error: 'Failed to fetch websites' });
  }
});

// GET /api/websites/:id - Get website by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const website = await Website.findById(req.params.id);
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    res.json(website);
  } catch (error) {
    logger.error('Error fetching website:', error);
    res.status(500).json({ error: 'Failed to fetch website' });
  }
});

// POST /api/websites - Create new website
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, url, keywords, isActive } = req.body as any;

    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }

    const website = await Website.create({
      name,
      url,
      keywords: keywords || [],
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(website);
  } catch (error) {
    logger.error('Error creating website:', error);
    res.status(500).json({ error: 'Failed to create website' });
  }
});

// PUT /api/websites/:id - Update website
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, url, keywords, isActive } = req.body as any;

    const website = await Website.findByIdAndUpdate(
      req.params.id,
      { name, url, keywords, isActive },
      { new: true, runValidators: true }
    );

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    res.json(website);
  } catch (error) {
    logger.error('Error updating website:', error);
    res.status(500).json({ error: 'Failed to update website' });
  }
});

// DELETE /api/websites/:id - Delete website
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const website = await Website.findByIdAndDelete(req.params.id);
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    res.json({ message: 'Website deleted successfully' });
  } catch (error) {
    logger.error('Error deleting website:', error);
    res.status(500).json({ error: 'Failed to delete website' });
  }
});

// PATCH /api/websites/:id/toggle - Toggle website active status
router.patch('/:id/toggle', async (req: Request, res: Response) => {
  try {
    const website = await Website.findById(req.params.id);
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    website.isActive = !website.isActive;
    await website.save();

    res.json(website);
  } catch (error) {
    logger.error('Error toggling website status:', error);
    res.status(500).json({ error: 'Failed to toggle website status' });
  }
});

export { router as websiteRoutes };