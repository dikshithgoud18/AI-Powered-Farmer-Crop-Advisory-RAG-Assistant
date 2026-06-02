import { Router } from 'express';
import { chatWithBot } from '../controllers/chatController';

const router = Router();

router.post('/query', chatWithBot);

export default router;
