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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = void 0;
const database_1 = require("../database/database");
class Time {
    constructor(row) {
        this.id = row.id;
        this.nome = row.nome;
        this.logo_url = row.logo_url || null;
    }
    static listarTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.db.all('SELECT * FROM times ORDER BY nome', [], (err, rows) => {
                    if (err)
                        return reject(err);
                    resolve(rows.map(row => new Time(row)));
                });
            });
        });
    }
}
exports.Time = Time;
