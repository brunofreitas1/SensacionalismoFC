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
exports.Usuario = void 0;
const database_1 = require("../database/database");
class Usuario {
    constructor(row) {
        this.id = row.id;
        this.nome = row.nome;
        this.email = row.email;
        this.senha = row.senha;
        this.data_nascimento = row.data_nascimento;
        this.cpf = row.cpf;
        this.time_id = row.time_id;
        this.foto_url = row.foto_url || null;
    }
    static buscarPorEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, row) => {
                    if (err)
                        return reject(err);
                    if (!row)
                        return resolve(null);
                    resolve(new Usuario(row));
                });
            });
        });
    }
    static buscarPorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, row) => {
                    if (err)
                        return reject(err);
                    if (!row)
                        return resolve(null);
                    resolve(new Usuario(row));
                });
            });
        });
    }
    static criar(dados) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.db.run('INSERT INTO usuarios (nome, email, senha, data_nascimento, cpf, time_id, foto_url) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                    dados.nome,
                    dados.email,
                    dados.senha,
                    dados.data_nascimento,
                    dados.cpf,
                    dados.time_id,
                    dados.foto_url || null
                ], function (err) {
                    if (err)
                        return reject(err);
                    resolve(this.lastID);
                });
            });
        });
    }
    static atualizarPerfil(id, nome, time_id, foto_url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.db.run('UPDATE usuarios SET nome = ?, time_id = ?, foto_url = ? WHERE id = ?', [nome, time_id, foto_url, id], function (err) {
                    if (err)
                        return reject(err);
                    resolve();
                });
            });
        });
    }
}
exports.Usuario = Usuario;
