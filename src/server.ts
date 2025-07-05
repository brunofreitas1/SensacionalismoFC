import express from 'express';
import path from 'path';
import { db, initializeDatabase } from './database/database';
import authRoutes from './routes/authRoutes';
import newsRoutes from './routes/newsRoutes';
import uploadRoutes from './routes/uploadRoutes';
import timeRoutes from './routes/timeRoutes';

const app = express();
const port = 3000;

// Configura o Express para usar o JSON
app.use(express.json());

// Configura o Express para servir arquivos estáticos (CSS, JS, imagens) da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configura o Express para servir arquivos HTML da pasta 'views'
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/times', timeRoutes);

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Rota para a página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'inicio.html'));
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
        console.error("❌ Falha crítica ao inicializar o banco de dados:", error);
        // Se o banco não puder ser iniciado, o processo termina para evitar mais erros.
        process.exit(1);
    }
})();