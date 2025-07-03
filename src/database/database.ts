import sqlite3 from 'sqlite3';
import fs from 'fs'; // 'File System' para ler arquivos
import path from 'path'; // Para construir caminhos de arquivos de forma segura

const DBSOURCE = "db.sqlite";
let db: sqlite3.Database;

// Função que inicializa a conexão e executa o schema
export const initializeDatabase = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DBSOURCE, (err) => {
            if (err) {
                console.error(err.message);
                return reject(err);
            }

            console.log('Conectado ao banco de dados SQLite.');

            // Lê o arquivo schema.sql
            const schemaPath = path.resolve(__dirname, 'schema.sql');
            fs.readFile(schemaPath, 'utf8', (err, sql) => {
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

// Exporta a instância 'db' para ser usada pelos controllers.
// É importante que ela seja exportada DEPOIS de ser inicializada.
export { db };