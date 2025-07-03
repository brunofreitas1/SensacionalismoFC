import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Configuração do multer para upload de avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/avatars'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

// Rota para upload de avatar
router.post('/avatar', protect, upload.single('avatar'), (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ message: 'Nenhum arquivo enviado.' }); return; }
  // @ts-ignore
  const url = '/uploads/avatars/' + req.file.filename;
  res.status(200).json({ url });
  return;
});

export default router;
