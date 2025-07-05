import { db } from '../database/database';

export class Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  data_nascimento: string;
  cpf: string;
  time_id: number;
  foto_url: string | null;

  constructor(row: any) {
    this.id = row.id;
    this.nome = row.nome;
    this.email = row.email;
    this.senha = row.senha;
    this.data_nascimento = row.data_nascimento;
    this.cpf = row.cpf;
    this.time_id = row.time_id;
    this.foto_url = row.foto_url || null;
  }

  static async buscarPorEmail(email: string): Promise<Usuario | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(new Usuario(row));
      });
    });
  }

  static async buscarPorId(id: number): Promise<Usuario | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(new Usuario(row));
      });
    });
  }

  static async criar(dados: {
    nome: string;
    email: string;
    senha: string;
    data_nascimento: string;
    cpf: string;
    time_id: number;
    foto_url?: string | null;
  }): Promise<number> {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO usuarios (nome, email, senha, data_nascimento, cpf, time_id, foto_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          dados.nome,
          dados.email,
          dados.senha,
          dados.data_nascimento,
          dados.cpf,
          dados.time_id,
          dados.foto_url || null
        ],
        function (err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  static async atualizarPerfil(id: number, nome: string, time_id: number, foto_url: string | null): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE usuarios SET nome = ?, time_id = ?, foto_url = ? WHERE id = ?',
        [nome, time_id, foto_url, id],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  // Outros métodos como atualizar senha, deletar usuário, etc. podem ser adicionados aqui
}
