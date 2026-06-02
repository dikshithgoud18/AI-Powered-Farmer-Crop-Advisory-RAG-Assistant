import { Router } from 'express';
import multer from 'multer';
import { uploadDocuments } from '../controllers/uploadController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.array('files'), uploadDocuments);

export default router;
