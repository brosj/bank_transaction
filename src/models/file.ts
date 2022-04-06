import fs from 'fs/promises';
import path from 'path';

import type { Transaction, Balance } from '../types';

const balancesDb = path.join(__dirname, '../../data/balances.json');
const transactionsDb = path.join(__dirname, '../../data/transactions.json');


export function readBalances(): Promise<Balance[]> {
  return fs.readFile(balancesDb, 'utf8').then((data) => {
    return JSON.parse(data);
  });
}

export function readTransactions(): Promise<Transaction[]> {
  return fs.readFile(transactionsDb, 'utf8').then((data) => {
    return JSON.parse(data);
  });
}

export function writeBalances(data: string) {
  return fs.writeFile(balancesDb, data);
}

export function writeTransactions(data: string) {
  return fs.writeFile(transactionsDb, data);
}
