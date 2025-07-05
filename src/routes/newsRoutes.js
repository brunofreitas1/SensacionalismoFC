"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsController_1 = require("../controllers/newsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// rota GET / pública (sem autenticação)
router.get('/', newsController_1.getNews);
router.get('/:id/comentarios', authMiddleware_1.protect, newsController_1.getComments);
router.post('/:id/comentarios', authMiddleware_1.protect, newsController_1.addComment);
router.get('/:id/curtidas', authMiddleware_1.protect, newsController_1.getLikes);
router.post('/:id/curtidas', authMiddleware_1.protect, newsController_1.toggleLike);
exports.default = router;
