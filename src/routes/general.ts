import express from 'express';
import * as generalController from '../controllers/General';

const router = express.Router();

router.get('/', generalController.getGeneral);
router.put('/', generalController.updateGeneral);
router.post('/', generalController.createGeneral);

export { router as generalRoutes };