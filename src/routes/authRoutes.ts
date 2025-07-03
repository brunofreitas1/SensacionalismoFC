import { Router } from 'express';
import { register, login, getTeams, getProfile, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Define a rota para registro. Quando uma requisição POST chegar em /api/auth/register,
// o método 'register' do nosso 'authController' será executado.
router.post('/register', register);

// Define a rota para login
router.post('/login', login);

// export const getTeams: RequestHandler = async (req, res) => { ... }
router.get('/teams', getTeams); 

// Rotas protegidas
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;