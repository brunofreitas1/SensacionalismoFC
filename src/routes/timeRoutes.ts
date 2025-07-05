import { Router } from 'express';
import { listarTimes } from '../controllers/timeController';

const router = Router();

// GET /times - lista todos os times
router.get('/', listarTimes);

export default router;
