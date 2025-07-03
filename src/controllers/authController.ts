// src/controllers/authController.ts

import { Request, Response, RequestHandler } from 'express';
import { db } from '../database/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- Helper para Promisificar as funções do DB ---
// Isso nos permite usar async/await com o sqlite3
const dbRun = (query: string, params: any[] = []) => {
    return new Promise<number>((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

const dbGet = <T>(query: string, params: any[] = []) => {
    return new Promise<T>((resolve, reject) => {
        db.get(query, params, (err, row: T) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};
// ---------------------------------------------------

export const register: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { nome, email, senha, data_nascimento, cpf, time_id } = req.body;

        // 1. Validação simples dos dados recebidos
        if (!nome || !email || !senha || !cpf) {
            res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos." });
            return;
        }

        // 2. Verifica se o e-mail ou CPF já existem (usando nossa função 'promisificada')
        const checkUserSql = `SELECT * FROM usuarios WHERE email = ? OR cpf = ?`;
        const existingUser = await dbGet<any>(checkUserSql, [email, cpf]);

        if (existingUser) {
            res.status(409).json({ message: "E-mail ou CPF já cadastrado." });
            return;
        }

        // 3. Criptografa a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // 4. Insere o novo usuário no banco de dados (usando nossa função 'promisificada')
        const insertSql = `INSERT INTO usuarios (nome, email, senha, data_nascimento, cpf, time_id) VALUES (?, ?, ?, ?, ?, ?)`;
        const userId = await dbRun(insertSql, [nome, email, hashedPassword, data_nascimento, cpf, time_id]);

        // Sucesso!
        res.status(201).json({ message: "Usuário cadastrado com sucesso!", userId });

    } catch (error) {
        console.error(error); // Bom para debugar no servidor
        res.status(500).json({ message: "Ocorreu um erro inesperado ao registrar." });
    }
};

// Método de login implementado
export const login: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            res.status(400).json({ message: "E-mail e senha são obrigatórios." });
            return;
        }

        // 1. Encontra o usuário pelo e-mail
        const user = await dbGet<any>('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado." });
            return;
        }

        // 2. Compara a senha enviada com a senha criptografada no banco
        const isPasswordMatch = await bcrypt.compare(senha, user.senha);
        if (!isPasswordMatch) {
            res.status(401).json({ message: "Senha incorreta." });
            return;
        }

        // 3. Gera um Token JWT
        // O ideal é guardar o 'JWT_SECRET' em uma variável de ambiente (.env)
        const token = jwt.sign(
            { id: user.id, email: user.email, time_id: user.time_id },
            'SEGREDO_SUPER_SECRETO_DO_SENSACIONALISMO_FC', // Troque isso por uma chave segura!
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

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocorreu um erro inesperado no login." });
    }
};

// export
export const getTeams: RequestHandler = async (req, res) => {
    try {
        const teams = await dbGetAll<any>('SELECT * FROM times ORDER BY nome');
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar times.' });
    }
};

// Buscar perfil do usuário autenticado
export const getProfile = async (req: any, res: Response) => {
    try {
        console.log('REQ.USER:', req.user); // LOG: payload do token
        const userId = req.user.id;
        const sql = `SELECT id, nome, email, time_id, foto_url FROM usuarios WHERE id = ?`;
        const user = await dbGet<any>(sql, [userId]);
        console.log('USER FROM DB:', user); // LOG: resultado da query
        if (!user) { res.status(404).json({ message: 'Usuário não encontrado.' }); return; }
        // Garante que foto_url sempre existe na resposta
        res.status(200).json({ ...user, foto_url: user.foto_url || null });
    } catch (error) {
        console.error('ERRO AO BUSCAR PERFIL:', error); // LOG: erro detalhado
        res.status(500).json({ message: 'Erro ao buscar perfil.' });
    }
    return;
};

// Atualizar perfil do usuário autenticado
export const updateProfile = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { nome, time_id, foto_url } = req.body;
        const sql = `UPDATE usuarios SET nome = ?, time_id = ?, foto_url = ? WHERE id = ?`;
        await dbRun(sql, [nome, time_id, foto_url, userId]);
        res.status(200).json({ message: 'Perfil atualizado!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar perfil.' });
    }
    return;
};

const dbGetAll = <T>(query: string, params: any[] = []) => {
    return new Promise<T[]>((resolve, reject) => {
        db.all(query, params, (err, rows: T[]) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};