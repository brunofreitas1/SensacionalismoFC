import { Router } from 'express';
import { getNews, getComments, addComment, getLikes, toggleLike } from '../controllers/newsController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// A rota GET para /api/news protegida.
// Se o token for válido, ele chama o 'getNews' (controller).
router.get('/', protect, getNews);
router.get('/:id/comentarios', protect, getComments);
router.post('/:id/comentarios', protect, addComment);
router.get('/:id/curtidas', protect, getLikes);
router.post('/:id/curtidas', protect, toggleLike);

export default router;