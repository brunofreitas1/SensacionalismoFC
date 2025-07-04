import { Router } from 'express';
import { getNews, getComments, addComment, getLikes, toggleLike } from '../controllers/newsController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// rota GET / pública (sem autenticação)
router.get('/', getNews);
router.get('/:id/comentarios', protect, getComments);
router.post('/:id/comentarios', protect, addComment);
router.get('/:id/curtidas', protect, getLikes);
router.post('/:id/curtidas', protect, toggleLike);

export default router;