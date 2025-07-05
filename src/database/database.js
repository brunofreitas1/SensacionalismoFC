"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.initializeDatabase = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const fs_1 = __importDefault(require("fs")); // 'File System' para ler arquivos
const path_1 = __importDefault(require("path")); // Para construir caminhos de arquivos de forma segura
const DBSOURCE = "db.sqlite";
let db;
// Função que inicializa a conexão e executa o schema
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        exports.db = db = new sqlite3_1.default.Database(DBSOURCE, (err) => {
            if (err) {
                console.error(err.message);
                return reject(err);
            }
            console.log('Conectado ao banco de dados SQLite.');
            // Lê o arquivo schema.sql
            const schemaPath = path_1.default.resolve(__dirname, 'schema.sql');
            fs_1.default.readFile(schemaPath, 'utf8', (err, sql) => {
                if (err) {
                    console.error("Não foi possível ler o arquivo schema.sql");
                    return reject(err);
                }
                // Executa todos os comandos SQL do arquivo de uma vez
                db.exec(sql, (err) => {
                    if (err) {
                        console.error("Erro ao executar o schema", err.message);
                        return reject(err);
                    }
                    console.log("Schema do banco de dados executado com sucesso.");
                    resolve();
                });
            });
        });
    });
};
exports.initializeDatabase = initializeDatabase;
