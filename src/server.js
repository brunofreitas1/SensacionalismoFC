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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database/database");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const newsRoutes_1 = __importDefault(require("./routes/newsRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const timeRoutes_1 = __importDefault(require("./routes/timeRoutes"));
const app = (0, express_1.default)();
const port = 3000;
// Configura o Express para usar o JSON
app.use(express_1.default.json());
// Configura o Express para servir arquivos estáticos (CSS, JS, imagens) da pasta 'public'
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Configura o Express para usar o EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Configura o Express para servir arquivos HTML da pasta 'views'
app.use('/api/auth', authRoutes_1.default);
app.use('/api/news', newsRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/times', timeRoutes_1.default);
// Rota para a página de login
app.get('/login', (req, res) => {
    res.render('login');
});
// Rota para a página de registro
app.get('/register', (req, res) => {
    res.render('register');
});
// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('inicio');
});
// Função auto-executável para inicializar e iniciar o servidor
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Garante que o banco de dados e as tabelas estão prontos
        yield (0, database_1.initializeDatabase)();
        console.log('✅ Banco de dados pronto para uso.');
        // 2. Inicia o servidor apenas se o banco de dados estiver OK
        app.listen(port, () => {
            console.log(`⚽ Sensacionalismo FC rodando no endereço http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("❌ Falha crítica ao inicializar o banco de dados:", error);
        // Se o banco não puder ser iniciado, o processo termina para evitar mais erros.
        process.exit(1);
    }
}))();
