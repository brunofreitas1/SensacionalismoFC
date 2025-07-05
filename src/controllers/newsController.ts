import { Request, Response } from 'express';
import { Noticia } from '../models/Noticia';

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const getNews = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user;
        let noticias;
        if (user && user.time_id) {
            noticias = await Noticia.listarPorTime(user.time_id);
        } else {
            noticias = await Noticia.listarTodas();
        }
        res.status(200).json(noticias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar notícias." });
    }
};

// Buscar comentários de uma notícia
export const getComments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const noticiaId = Number(req.params.id);
        const comentarios = await Noticia.buscarComentarios(noticiaId);
        res.status(200).json(comentarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar comentários.' });
    }
};

// Adicionar comentário a uma notícia
export const addComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const noticiaId = Number(req.params.id);
        const usuarioId = req.user.id;
        const { texto } = req.body;
        if (!texto || !texto.trim()) {
            res.status(400).json({ message: 'Comentário vazio.' });
            return;
        }
        await Noticia.adicionarComentario(noticiaId, usuarioId, texto.trim());
        res.status(201).json({ message: 'Comentário adicionado!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar comentário.' });
    }
};

// Buscar contagem de curtidas de uma notícia
export const getLikes = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const noticiaId = Number(req.params.id);
        const total = await Noticia.contarCurtidas(noticiaId);
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar curtidas.' });
    }
};

// Curtir/Descurtir uma notícia
export const toggleLike = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const noticiaId = Number(req.params.id);
        const usuarioId = req.user.id;
        const liked = await Noticia.toggleCurtir(noticiaId, usuarioId);
        res.status(liked ? 201 : 200).json({ liked });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao curtir/descurtir.' });
    }
};