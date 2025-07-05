"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Define a rota para registro. Quando uma requisição POST chegar em /api/auth/register,
// o método 'register' do nosso 'authController' será executado.
router.post('/register', authController_1.register);
// Define a rota para login
router.post('/login', authController_1.login);
// export const getTeams: RequestHandler = async (req, res) => { ... }
router.get('/teams', authController_1.getTeams);
// Rotas protegidas
router.get('/profile', authMiddleware_1.protect, authController_1.getProfile);
router.put('/profile', authMiddleware_1.protect, authController_1.updateProfile);
exports.default = router;
