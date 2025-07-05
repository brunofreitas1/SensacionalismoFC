import { db } from '../database/database';

export class Time {
  id: number;
  nome: string;
  logo_url: string | null;

  constructor(row: any) {
    this.id = row.id;
    this.nome = row.nome;
    this.logo_url = row.logo_url || null;
  }

  static async listarTodos(): Promise<Time[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM times ORDER BY nome', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.map(row => new Time(row)));
      });
    });
  }
}
