"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLike = exports.getLikes = exports.addComment = exports.getComments = exports.getNews = void 0;
const Noticia_1 = require("../models/Noticia");
const getNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        let noticias;
        if (user && user.time_id) {
            noticias = yield Noticia_1.Noticia.listarPorTime(user.time_id);
        }
        else {
            noticias = yield Noticia_1.Noticia.listarTodas();
        }
        res.status(200).json(noticias);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar notícias." });
    }
});
exports.getNews = getNews;
// Buscar comentários de uma notícia
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noticiaId = Number(req.params.id);
        const comentarios = yield Noticia_1.Noticia.buscarComentarios(noticiaId);
        res.status(200).json(comentarios);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar comentários.' });
    }
});
exports.getComments = getComments;
// Adicionar comentário a uma notícia
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noticiaId = Number(req.params.id);
        const usuarioId = req.user.id;
        const { texto } = req.body;
        if (!texto || !texto.trim()) {
            res.status(400).json({ message: 'Comentário vazio.' });
            return;
        }
        yield Noticia_1.Noticia.adicionarComentario(noticiaId, usuarioId, texto.trim());
        res.status(201).json({ message: 'Comentário adicionado!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar comentário.' });
    }
});
exports.addComment = addComment;
// Buscar contagem de curtidas de uma notícia
const getLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noticiaId = Number(req.params.id);
        const total = yield Noticia_1.Noticia.contarCurtidas(noticiaId);
        res.status(200).json({ total });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar curtidas.' });
    }
});
exports.getLikes = getLikes;
// Curtir/Descurtir uma notícia
const toggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noticiaId = Number(req.params.id);
        const usuarioId = req.user.id;
        const liked = yield Noticia_1.Noticia.toggleCurtir(noticiaId, usuarioId);
        res.status(liked ? 201 : 200).json({ liked });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao curtir/descurtir.' });
    }
});
exports.toggleLike = toggleLike;
