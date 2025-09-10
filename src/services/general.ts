import { General, IGeneral } from '../models/General';
import { logger } from '../utils/logger';


export const getGeneral = async (): Promise<IGeneral> => {
  try {
    let general = await General.findOne({});
    if (!general) {
      general = await General.create({
        keywords: [
          'student',
          'intern',
          'internship',
          'entry level',
          'junior',
          'graduate',
          'trainee',
          'part time',
          'remote',
          'work from home',
        ],
        interval: 30,
      });
    }

    return general;
  } catch (error) {
    logger.error('Error getting general settings:', error);
    throw error;
  }
};