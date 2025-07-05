import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { db, initializeDatabase } from './database/database';
import authRoutes from './routes/authRoutes';
import newsRoutes from './routes/newsRoutes';
import uploadRoutes from './routes/uploadRoutes';
import timeRoutes from './routes/timeRoutes';
import { protect } from './middleware/authMiddleware';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(cookieParser());

// Configura o Express para usar o JSON
app.use(express.json());

// Middleware para processar dados de formulários
app.use(express.urlencoded({ extended: true }));

// Configura o Express para servir arquivos estáticos (CSS, JS, imagens) da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configura o Express para usar o EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para disponibilizar o usuário logado (se houver) nas views EJS
app.use((req, res, next) => {
    let token = null;
    // Tenta pegar o token do cookie ou do header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (token) {
        try {
            const decoded = jwt.verify(token, 'SEGREDO_SUPER_SECRETO_DO_SENSACIONALISMO_FC');
            res.locals.user = decoded;
        } catch (e) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

// Configura o Express para servir arquivos HTML da pasta 'views'
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/times', timeRoutes);

// Rota para a página de login
app.get('/login', (req, res) => {
    res.render('login', { user: res.locals.user });
});

// Função utilitária para promessas sqlite3
function dbAllAsync(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    });
}
function dbGetAsync(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    });
}
function dbRunAsync(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err); else resolve(this.lastID);
        });
    });
}

// Rota para a página de registro (GET)
app.get('/register', async (req, res) => {
    const times = await dbAllAsync('SELECT * FROM times ORDER BY nome');
    res.render('register', { values: {}, errors: {}, times, user: res.locals.user });
});

// Rota para cadastro (POST)
app.post('/register', async (req, res) => {
    const { nome, email, senha, cpf, data_nascimento, time_id } = req.body;
    const values = { nome, email, senha, cpf, data_nascimento, time_id };
    const errors: any = {};
    // Validação simples
    if (!nome) errors.nome = 'Nome obrigatório';
    if (!email) errors.email = 'E-mail obrigatório';
    if (!senha) errors.senha = 'Senha obrigatória';
    if (!cpf) errors.cpf = 'CPF obrigatório';
    if (!data_nascimento) errors.data_nascimento = 'Data de nascimento obrigatória';
    if (!time_id) errors.time_id = 'Selecione um time';
    // Verifica se já existe usuário
    let existingUser = null;
    if (email) existingUser = await dbGetAsync('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existingUser) errors.email = 'E-mail já cadastrado';
    if (Object.keys(errors).length > 0) {
        const times = await dbAllAsync('SELECT * FROM times ORDER BY nome');
        return res.status(400).render('register', { values, errors, times, user: res.locals.user });
    }
    // Cria usuário
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);
    await dbRunAsync('INSERT INTO usuarios (nome, email, senha, data_nascimento, cpf, time_id) VALUES (?, ?, ?, ?, ?, ?)',
        [nome, email, hashedPassword, data_nascimento, cpf, time_id]);
    const times = await dbAllAsync('SELECT * FROM times ORDER BY nome');
    res.render('register', { values: {}, errors: { success: 'Cadastro realizado com sucesso! Faça login.' }, times, user: res.locals.user });
});

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('inicio', { user: res.locals.user });
});

// Função auto-executável para inicializar e iniciar o servidor
(async () => {
    try {
        // 1. Garante que o banco de dados e as tabelas estão prontos
        await initializeDatabase();
        console.log('✅ Banco de dados pronto para uso.');

        // 2. Inicia o servidor apenas se o banco de dados estiver OK
        app.listen(port, () => {
            console.log(`⚽ Sensacionalismo FC rodando no endereço http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Falha crítica ao inicializar o banco de dados:", error);
        // Se o banco não puder ser iniciado, o processo termina para evitar mais erros.
        process.exit(1);
    }
})();