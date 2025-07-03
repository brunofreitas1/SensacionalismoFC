import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estendemos a interface Request do Express para incluir a propriedade 'user'
interface AuthenticatedRequest extends Request {
    user?: any;
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            // Extrai o token do cabeçalho (formato "Bearer TOKEN")
            token = authHeader.split(' ')[1];

            // Verifica e decodifica o token
            const decoded = jwt.verify(token, 'SEGREDO_SUPER_SECRETO_DO_SENSACIONALISMO_FC');

            // Anexa os dados do usuário (que estavam no token) ao objeto 'req'
            // para que as próximas rotas possam usá-los
            req.user = decoded;

            next(); // Deixa o usuário passar para a próxima etapa (o controller)
            return; // Importante: sai da função após chamar next()
        } catch (error) {
            console.error('Erro de autenticação', error);
            res.status(401).json({ message: 'Não autorizado, token falhou.' });
            return;
        }
    }

    // Se não há token, retorna erro 401
    res.status(401).json({ message: 'Não autorizado, nenhum token encontrado.' });
};