"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Configuração do multer para upload de avatar
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../public/uploads/avatars'));
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + ext);
    }
});
const upload = (0, multer_1.default)({ storage });
// Rota para upload de avatar
router.post('/avatar', authMiddleware_1.protect, upload.single('avatar'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'Nenhum arquivo enviado.' });
        return;
    }
    // @ts-ignore
    const url = '/uploads/avatars/' + req.file.filename;
    res.status(200).json({ url });
    return;
});
exports.default = router;
