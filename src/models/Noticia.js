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
exports.Noticia = void 0;
const database_1 = require("../database/database");
class Noticia {
    constructor(row) {
        this.id = row.id;
        this.titulo = row.titulo;
        this.conteudo = row.conteudo;
        this.imagem_url = row.imagem_url;
        this.time_id = row.time_id;
    }
    static listarTodas() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.db.all('SELECT * FROM noticias ORDER BY id DESC', [], (err, rows) => {
                    if (err)
                        return reject(err);
                    resolve(rows.map(row => new Noticia(row)));
                });
            });
        });
    }
    static listarPorTime(time_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.db.all('SELECT * FROM noticias WHERE time_id = ? AND time_id IS NOT NULL ORDER BY id DESC', [time_id], (err, rows) => {
                    if (err)
                        return reject(err);
                    resolve(rows.map(row => new Noticia(row)));
                });
            });
        });
    }
    static listarComPrioridade(time_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (time_id) {
                    database_1.db.all(`SELECT * FROM noticias
           ORDER BY CASE WHEN time_id = ? THEN 0 ELSE 1 END, id DESC`, [time_id], (err, rows) => {
                        if (err)
                            return reject(err);
                        resolve(rows.map(row => new Noticia(row)));
                    });
                }
                else {
                    database_1.db.all('SELECT * FROM noticias ORDER BY id DESC', [], (err, rows) => {
                        if (err)
                            return reject(err);
                        resolve(rows.map(row => new Noticia(row)));
                    });
                }
            });
        });
    }
    static buscarComentarios(noticiaId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.db.all(`SELECT c.*, u.nome as usuario_nome FROM comentarios c JOIN usuarios u ON c.usuario_id = u.id WHERE c.noticia_id = ? ORDER BY c.data_comentario DESC`, [noticiaId], (err, rows) => {
                    if (err)
                        return reject(err);
                    resolve(rows);
                });
            });
        });
    }
    static adicionarComentario(noticiaId, usuarioId, texto) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.db.run(`INSERT INTO comentarios (noticia_id, usuario_id, texto) VALUES (?, ?, ?)`, [noticiaId, usuarioId, texto], function (err) {
                    if (err)
                        return reject(err);
                    resolve();
                });
            });
        });
    }
    static contarCurtidas(noticiaId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.db.get(`SELECT COUNT(*) as total FROM curtidas WHERE noticia_id = ?`, [noticiaId], (err, row) => {
                    if (err)
                        return reject(err);
                    resolve((row === null || row === void 0 ? void 0 : row.total) || 0);
                });
            });
        });
    }
    static toggleCurtir(noticiaId, usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.db.get(`SELECT id FROM curtidas WHERE noticia_id = ? AND usuario_id = ?`, [noticiaId, usuarioId], (err, row) => {
                    if (err)
                        return reject(err);
                    if (row) {
                        database_1.db.run(`DELETE FROM curtidas WHERE noticia_id = ? AND usuario_id = ?`, [noticiaId, usuarioId], function (err) {
                            if (err)
                                return reject(err);
                            resolve(false); // descurtiu
                        });
                    }
                    else {
                        database_1.db.run(`INSERT INTO curtidas (noticia_id, usuario_id) VALUES (?, ?)`, [noticiaId, usuarioId], function (err) {
                            if (err)
                                return reject(err);
                            resolve(true); // curtiu
                        });
                    }
                });
            });
        });
    }
}
exports.Noticia = Noticia;
