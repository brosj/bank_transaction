import {
  readBalances,
  readTransactions,
  writeBalances,
  writeTransactions
} from '../models/file';
import { randomUUID } from 'crypto';
import zod from 'zod';

import { Balance, Transaction, Transfer } from '../types';


export async function getAllBalances() {
  return readBalances();
}


export async function getAllTransactions() {
  return readTransactions();
}


export async function getSingleBalance(accountNo: number) {
  const accNumSchema = zod.number({invalid_type_error: "Invalid account number"}).gte(3000000000).lte(3999999999);
  accountNo = accNumSchema.parse(accountNo);

  const balances = await readBalances();
  const accountIndex = balances.findIndex(account => account.accountNo === accountNo);
  if (accountIndex === -1) {
    throw Error('Account not found');
  }
  return balances[accountIndex];
}


export async function createAccount(balance: number) {
  const balanceSchema = zod.number().nonnegative();

  const account: Balance = {
    accountNo: generateAccount(),
    balance: balanceSchema.parse(balance),
    createdAt: new Date()
  };

  let allAccounts = await readBalances();
  allAccounts.push(account);
  await writeBalances(JSON.stringify(allAccounts));
  return account.accountNo;
}


export async function transfer(input: Record<string, unknown>) {
  const transactionSchema = zod.object({
    from: zod.number({invalid_type_error: "Invalid account number"}).gte(3000000000).lte(3999999999),
    to: zod.number({invalid_type_error: "Invalid account number"}).gte(3000000000).lte(3999999999),
    amount: zod.number().positive(),
    transferDescription: zod.string().optional()
  });

  const value = transactionSchema.parse(input);

  const transaction: Transaction = {
    ...value,
    reference: randomUUID(),
    createdAt: new Date()
  }

  const allAccounts = await readBalances();

  // Validate account numbers
  const sndAccIndx = allAccounts.findIndex(acct => acct.accountNo === transaction.from);
  const rcvAccIndx = allAccounts.findIndex(acct => acct.accountNo === transaction.to);

  if (sndAccIndx === -1) {
    throw Error('Sender account not found.');
  }
  if (rcvAccIndx === -1) {
    throw Error('Receiver account not found.');
  }

  // Validate sender's balance
  if (allAccounts[sndAccIndx].balance < transaction.amount) {
    throw Error('Insufficient funds.');
  }

  // Update sender's and receiver's balance
  allAccounts[sndAccIndx].balance -= transaction.amount;
  allAccounts[rcvAccIndx].balance += transaction.amount;

  // Update balances database
  await writeBalances(JSON.stringify(allAccounts));

  // Read from and update transaction database
  const allTransactions = await readTransactions();
  allTransactions.push(transaction);
  await writeTransactions(JSON.stringify(allTransactions));

  return true;
}


function generateAccount(): number {
  let arr: number[] = Array(10).fill(0).map(val => Math.floor(Math.random()*10));
  arr[0] = 3;
  const accNo = Number(arr.join(''));
  return accNo;
}
