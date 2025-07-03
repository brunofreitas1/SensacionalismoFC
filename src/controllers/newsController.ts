import { Request, Response } from 'express';
import { db } from '../database/database';

interface AuthenticatedRequest extends Request {
    user?: any;
}

// Helper para 'promisificar' o db.all
const dbGetAll = <T>(query: string, params: any[] = []) => {
    return new Promise<T[]>((resolve, reject) => {
        db.all(query, params, (err, rows: T[]) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Helper para 'promisificar' o db.run
const dbRun = (query: string, params: any[] = []) => {
    return new Promise<void>((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
};

export const getNews = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user; // Pegamos os dados do usuário que o middleware decodificou

        // Nossa consulta SQL inteligente:
        // Usa CASE para colocar as notícias do time do coração do usuário primeiro.
        const sql = `
            SELECT * FROM noticias
            ORDER BY
                CASE
                    WHEN time_id = ? THEN 0
                    ELSE 1
                END,
            id DESC
        `;

        const news = await dbGetAll<any>(sql, [user.time_id]);
        res.status(200).json(news);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar notícias." });
    }
};

// Buscar comentários de uma notícia
export const getComments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const noticiaId = req.params.id;
        const sql = `SELECT c.*, u.nome as usuario_nome FROM comentarios c JOIN usuarios u ON c.usuario_id = u.id WHERE c.noticia_id = ? ORDER BY c.data_comentario DESC`;
        const comentarios = await dbGetAll<any>(sql, [noticiaId]);
        res.status(200).json(comentarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar comentários.' });
    }
};

// Adicionar comentário a uma notícia
export const addComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const noticiaId = req.params.id;
        const usuarioId = req.user.id;
        const { texto } = req.body;
        if (!texto || !texto.trim()) {
            res.status(400).json({ message: 'Comentário vazio.' });
            return;
        }
        const sql = `INSERT INTO comentarios (noticia_id, usuario_id, texto) VALUES (?, ?, ?)`;
        await dbRun(sql, [noticiaId, usuarioId, texto.trim()]);
        res.status(201).json({ message: 'Comentário adicionado!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar comentário.' });
    }
};

// Buscar contagem de curtidas de uma notícia
export const getLikes = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const noticiaId = req.params.id;
        const sql = `SELECT COUNT(*) as total FROM curtidas WHERE noticia_id = ?`;
        const result = await dbGetAll<any>(sql, [noticiaId]);
        res.status(200).json({ total: result[0]?.total || 0 });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar curtidas.' });
    }
};

// Curtir/Descurtir uma notícia
export const toggleLike = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const noticiaId = req.params.id;
        const usuarioId = req.user.id;
        // Verifica se já curtiu
        const sqlCheck = `SELECT id FROM curtidas WHERE noticia_id = ? AND usuario_id = ?`;
        const curtidas = await dbGetAll<any>(sqlCheck, [noticiaId, usuarioId]);
        if (curtidas.length > 0) {
            // Descurtir
            const sqlDel = `DELETE FROM curtidas WHERE noticia_id = ? AND usuario_id = ?`;
            await dbRun(sqlDel, [noticiaId, usuarioId]);
            res.status(200).json({ liked: false });
        } else {
            // Curtir
            const sqlAdd = `INSERT INTO curtidas (noticia_id, usuario_id) VALUES (?, ?)`;
            await dbRun(sqlAdd, [noticiaId, usuarioId]);
            res.status(201).json({ liked: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao curtir/descurtir.' });
    }
};