import { Request, Response } from 'express';
import { Time } from '../models/Time';

// Lista todos os times
export const listarTimes = async (req: Request, res: Response) => {
  try {
    const times = await Time.listarTodos();
    res.status(200).json(times);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar times.' });
  }
};

