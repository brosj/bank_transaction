export interface Transaction {
  reference: string;
  from: number;
  to: number;
  amount: number;
  transferDescription?: string;
  createdAt: Date;
}

export interface Balance {
  accountNo: number;
  balance: number;
  createdAt: Date;
}

export interface Transfer {
  from: number,
  to: number,
  amount: number,
  description?: string
}
