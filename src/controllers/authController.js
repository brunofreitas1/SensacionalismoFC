"use strict";
// src/controllers/authController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.getTeams = exports.login = exports.register = void 0;
const Usuario_1 = require("../models/Usuario");
const Time_1 = require("../models/Time");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database/database");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, email, senha, data_nascimento, cpf, time_id } = req.body;
        // 1. Validação simples dos dados recebidos
        if (!nome || !email || !senha || !cpf) {
            res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos." });
            return;
        }
        // 2. Verifica se o e-mail ou CPF já existem (usando nossa função 'promisificada')
        const existingUser = yield Usuario_1.Usuario.buscarPorEmail(email);
        if (existingUser) {
            res.status(409).json({ message: "E-mail ou CPF já cadastrado." });
            return;
        }
        // 3. Criptografa a senha antes de salvar
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(senha, salt);
        // 4. Insere o novo usuário no banco de dados (usando nossa função 'promisificada')
        const userId = yield Usuario_1.Usuario.criar({
            nome,
            email,
            senha: hashedPassword,
            data_nascimento,
            cpf,
            time_id
        });
        // Sucesso!
        res.status(201).json({ message: "Usuário cadastrado com sucesso!", userId });
    }
    catch (error) {
        console.error(error); // Bom para debugar no servidor
        res.status(500).json({ message: "Ocorreu um erro inesperado ao registrar." });
    }
});
exports.register = register;
// Método de login implementado
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            res.status(400).json({ message: "E-mail e senha são obrigatórios." });
            return;
        }
        // 1. Encontra o usuário pelo e-mail usando o model
        const user = yield Usuario_1.Usuario.buscarPorEmail(email);
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado." });
            return;
        }
        // 2. Compara a senha enviada com a senha criptografada no banco
        const isPasswordMatch = yield bcryptjs_1.default.compare(senha, user.senha);
        if (!isPasswordMatch) {
            res.status(401).json({ message: "Senha incorreta." });
            return;
        }
        // 3. Gera um Token JWT
        // O ideal é guardar o 'JWT_SECRET' em uma variável de ambiente (.env)
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, time_id: user.time_id }, 'SEGREDO_SUPER_SECRETO_DO_SENSACIONALISMO_FC', // Troque isso por uma chave segura!
        { expiresIn: '8h' } // Token expira em 8 horas
        );
        // 4. Envia o token para o cliente
        res.status(200).json({
            message: "Login realizado com sucesso!",
            token: token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                time_id: user.time_id,
                foto_url: user.foto_url || null
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocorreu um erro inesperado no login." });
    }
});
exports.login = login;
// export
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield Time_1.Time.listarTodos();
        res.status(200).json(teams);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar times.' });
    }
});
exports.getTeams = getTeams;
// Buscar perfil do usuário autenticado
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const user = yield Usuario_1.Usuario.buscarPorId(userId);
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado.' });
            return;
        }
        res.status(200).json(Object.assign(Object.assign({}, user), { foto_url: user.foto_url || null }));
    }
    catch (error) {
        console.error('ERRO AO BUSCAR PERFIL:', error);
        res.status(500).json({ message: 'Erro ao buscar perfil.' });
    }
});
exports.getProfile = getProfile;
// Atualizar perfil do usuário autenticado
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { nome, time_id, foto_url } = req.body;
        yield Usuario_1.Usuario.atualizarPerfil(userId, nome, time_id, foto_url);
        res.status(200).json({ message: 'Perfil atualizado!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar perfil.' });
    }
});
exports.updateProfile = updateProfile;
const dbGetAll = (query, params = []) => {
    return new Promise((resolve, reject) => {
        database_1.db.all(query, params, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
};
