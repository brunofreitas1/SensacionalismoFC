"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            // Extrai o token do cabeçalho (formato "Bearer TOKEN")
            token = authHeader.split(' ')[1];
            // Verifica e decodifica o token
            const decoded = jsonwebtoken_1.default.verify(token, 'SEGREDO_SUPER_SECRETO_DO_SENSACIONALISMO_FC');
            // Anexa os dados do usuário (que estavam no token) ao objeto 'req'
            // para que as próximas rotas possam usá-los
            req.user = decoded;
            next(); // Deixa o usuário passar para a próxima etapa (o controller)
            return; // Importante: sai da função após chamar next()
        }
        catch (error) {
            console.error('Erro de autenticação', error);
            res.status(401).json({ message: 'Não autorizado, token falhou.' });
            return;
        }
    }
    // Se não há token, retorna erro 401
    res.status(401).json({ message: 'Não autorizado, nenhum token encontrado.' });
};
exports.protect = protect;
