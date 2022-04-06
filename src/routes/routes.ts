import express from 'express';
import httpStatus from 'http-status';
import zod from 'zod';

import {
  getAllBalances,
  getSingleBalance,
  createAccount,
  transfer,
} from '../controllers/handlers';

const router = express.Router();

// POST: Create a new account
router.post('/create-account', async function (req, res) {
  const balance = req.body.initialDeposit;

  try {
    const account = createAccount(balance);
    res.status(httpStatus.CREATED).json({
      msg: 'Account created successfully',
      accountNo: await account,
    });
  } catch (err) {
    if (err instanceof zod.ZodError) {
      res.status(httpStatus.BAD_REQUEST).json({ error: err.flatten() });
    }
    if (err instanceof Error) {
      res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
    }
  }
});

// GET: Get all accounts balance
router.get('/balance', async function (_req, res) {
  const data = await getAllBalances();
  data.length
    ? res.status(httpStatus.OK).json(data)
    : res.status(httpStatus.OK).send('No data available.');
});

// GET: Get a single account balance
router.get('/balance/:accountNumber', async function (req, res) {
  const id = +req.params.accountNumber;

  try {
    const data = await getSingleBalance(id);

    res.status(httpStatus.OK).json(data);
  } catch (err) {
    if (err instanceof zod.ZodError) {
      res.status(httpStatus.BAD_REQUEST).json({ error: err.flatten() });
    }
    if (err instanceof Error) {
      res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
    }
  }
});

// POST: Make a new transaction
router.post('/transfer', async function (req, res) {
  const data = req.body;

  try {
    const performTransfer = transfer(data);
    res.status(httpStatus.OK).json({ msg: 'Transfer successful.' });
  } catch (err) {
    if (err instanceof zod.ZodError) {
      res.status(httpStatus.BAD_REQUEST).json({ error: err.flatten() });
    }
    if (err instanceof Error) {
      res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
    }
  }
});

export default router;
