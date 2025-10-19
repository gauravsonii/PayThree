export interface Employee {
  _id: string;
  name: string;
  email: string;
  walletAddress: string;
  salaryUSD: number;
  designation: string;
  createdAt: string;
  __v: number;
}

export interface ESOP {
  _id: string;
  employeeId: string;
  tokenAmount: number;
  vestingStart: string;
  cliffMonths: number;
  vestingMonths: number;
  createdAt: string;
  __v: number;
}

export interface PayoutBatch {
  _id: string;
  txHash: string;
  totalAmount: number;
  createdAt: string;
  __v: number;
}

export interface Payout {
  _id: string;
  batchId: string | PayoutBatch;
  employeeId: string | Employee;
  amountUSD: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  __v: number;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  walletAddress: string;
  salaryUSD: number;
  designation: string;
}

export interface CreateESOPRequest {
  employeeId: string;
  tokenAmount: number;
  vestingStart: string;
  cliffMonths: number;
  vestingMonths: number;
}

export interface BatchPayoutRequest {
  txHash: string;
  payouts: {
    employeeId: string;
    amountUSD: number;
  }[];
}

export interface Settings {
  _id: string;
  organizationName: string;
  tokenAddress: string;
  network: string;
  autoPayouts: boolean;
  notifications: boolean;
  databaseUrl: string;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsRequest {
  organizationName?: string;
  tokenAddress?: string;
  network?: string;
  autoPayouts?: boolean;
  notifications?: boolean;
  databaseUrl?: string;
  apiKey?: string;
}

// Treasury Types
export interface Treasury {
  _id: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TreasuryTransaction {
  _id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  description: string;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
  userId?: string;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateTreasuryTransactionRequest {
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
  userId?: string;
  walletAddress?: string;
}

export interface TreasuryBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}