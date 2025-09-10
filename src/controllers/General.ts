import { Request, Response } from 'express';
import { General, IGeneral } from '../models/General';
import { logger } from '../utils/logger';
import { getGeneral as getGeneralService } from '../services/general';
export const getGeneral = async (req: Request, res: Response): Promise<Response> => {
  try {
    const general = await getGeneralService();
    return res.status(200).json(general);
  } catch (error) {
    logger.error('Error getting general settings:', error);
    return res.status(500).json({ error: 'Failed to get general settings' });
  }
};

export const updateGeneral = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { keywords, interval } = req.body;

    // Try to find existing settings
    let general = await General.findOne({});

    if (general) {
      // Update existing settings
      general = await General.findOneAndUpdate(
        {},
        { keywords, interval },
        { new: true, upsert: true }
      );
    } else {
      // Create new settings if none exist
      general = await General.create({ keywords, interval });
    }

    return res.status(200).json(general);
  } catch (error) {
    logger.error('Error updating general settings:', error);
    return res.status(500).json({ error: 'Failed to update general settings' });
  }
};

export const createGeneral = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { keywords, interval } = req.body;
    const general = await General.create({ keywords, interval });
    return res.status(201).json(general);
  } catch (error) {
    logger.error('Error creating general settings:', error);
    return res.status(500).json({ error: 'Failed to create general settings' });
  }
};