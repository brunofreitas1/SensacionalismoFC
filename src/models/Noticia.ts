import { db } from '../database/database';

export class Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  imagem_url: string;
  time_id: number | null;

  constructor(row: any) {
    this.id = row.id;
    this.titulo = row.titulo;
    this.conteudo = row.conteudo;
    this.imagem_url = row.imagem_url;
    this.time_id = row.time_id;
  }

  static async listarTodas(): Promise<Noticia[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM noticias ORDER BY id DESC', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.map(row => new Noticia(row)));
      });
    });
  }

  static async listarPorTime(time_id: number): Promise<Noticia[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM noticias WHERE time_id = ? AND time_id IS NOT NULL ORDER BY id DESC', [time_id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.map(row => new Noticia(row)));
      });
    });
  }

  static async listarComPrioridade(time_id?: number): Promise<Noticia[]> {
    return new Promise((resolve, reject) => {
      if (time_id) {
        db.all(
          `SELECT * FROM noticias
           ORDER BY CASE WHEN time_id = ? THEN 0 ELSE 1 END, id DESC`,
          [time_id],
          (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(row => new Noticia(row)));
          }
        );
      } else {
        db.all('SELECT * FROM noticias ORDER BY id DESC', [], (err, rows) => {
          if (err) return reject(err);
          resolve(rows.map(row => new Noticia(row)));
        });
      }
    });
  }

  static async buscarComentarios(noticiaId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT c.*, u.nome as usuario_nome FROM comentarios c JOIN usuarios u ON c.usuario_id = u.id WHERE c.noticia_id = ? ORDER BY c.data_comentario DESC`,
        [noticiaId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async adicionarComentario(noticiaId: number, usuarioId: number, texto: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO comentarios (noticia_id, usuario_id, texto) VALUES (?, ?, ?)` ,
        [noticiaId, usuarioId, texto],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  static async contarCurtidas(noticiaId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as total FROM curtidas WHERE noticia_id = ?`,
        [noticiaId],
        (err, row: { total: number }) => {
          if (err) return reject(err);
          resolve(row?.total || 0);
        }
      );
    });
  }

  static async toggleCurtir(noticiaId: number, usuarioId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id FROM curtidas WHERE noticia_id = ? AND usuario_id = ?`,
        [noticiaId, usuarioId],
        (err, row) => {
          if (err) return reject(err);
          if (row) {
            db.run(
              `DELETE FROM curtidas WHERE noticia_id = ? AND usuario_id = ?`,
              [noticiaId, usuarioId],
              function (err) {
                if (err) return reject(err);
                resolve(false); // descurtiu
              }
            );
          } else {
            db.run(
              `INSERT INTO curtidas (noticia_id, usuario_id) VALUES (?, ?)`,
              [noticiaId, usuarioId],
              function (err) {
                if (err) return reject(err);
                resolve(true); // curtiu
              }
            );
          }
        }
      );
    });
  }
}
