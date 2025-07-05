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
exports.listarTimes = void 0;
const Time_1 = require("../models/Time");
// Lista todos os times
const listarTimes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const times = yield Time_1.Time.listarTodos();
        res.status(200).json(times);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar times.' });
    }
});
exports.listarTimes = listarTimes;
