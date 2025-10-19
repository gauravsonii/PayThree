import { Employee, ESOP, PayoutBatch, Payout, CreateEmployeeRequest, CreateESOPRequest, BatchPayoutRequest, Settings, UpdateSettingsRequest, TreasuryTransaction, CreateTreasuryTransactionRequest } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Employee API
export const employeeApi = {
  getAll: async (): Promise<Employee[]> => {
    const response = await fetch(`${API_BASE_URL}/api/employees`);
    const data = await response.json();
    return data.employees;
  },

  create: async (employee: CreateEmployeeRequest): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/api/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    });
    const data = await response.json();
    return data.employee;
  },
};

// ESOP API
export const esopApi = {
  getAll: async (): Promise<ESOP[]> => {
    const response = await fetch(`${API_BASE_URL}/api/esops`);
    const data = await response.json();
    return data.esops;
  },

  create: async (esop: CreateESOPRequest): Promise<ESOP> => {
    const response = await fetch(`${API_BASE_URL}/api/esops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(esop),
    });
    const data = await response.json();
    return data.esop;
  },
};

// Payout API
export const payoutApi = {
  createBatch: async (batchData: BatchPayoutRequest) => {
    const response = await fetch(`${API_BASE_URL}/api/payouts/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchData),
    });
    return response.json();
  },

  getBatches: async (): Promise<PayoutBatch[]> => {
    const response = await fetch(`${API_BASE_URL}/api/payouts/batch`);
    return response.json();
  },

  getBatchPayouts: async (batchId: string): Promise<Payout[]> => {
    const response = await fetch(`${API_BASE_URL}/api/payouts/batch/${batchId}`);
    return response.json();
  },

  getEmployeePayouts: async (employeeId: string): Promise<Payout[]> => {
    const response = await fetch(`${API_BASE_URL}/api/payouts/employee/${employeeId}`);
    return response.json();
  },
};

// Settings API
export const settingsApi = {
  get: async (): Promise<Settings> => {
    const response = await fetch(`${API_BASE_URL}/api/settings`);
    const data = await response.json();
    return data.settings;
  },

  update: async (settings: UpdateSettingsRequest): Promise<Settings> => {
    const response = await fetch(`${API_BASE_URL}/api/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    const data = await response.json();
    return data.settings;
  },
};

// Treasury API
export const treasuryApi = {
  getTransactions: async (): Promise<TreasuryTransaction[]> => {
    const response = await fetch(`${API_BASE_URL}/api/treasury/transactions`);
    const data = await response.json();
    return data.transactions;
  },

  createTransaction: async (transaction: CreateTreasuryTransactionRequest): Promise<TreasuryTransaction> => {
    const response = await fetch(`${API_BASE_URL}/api/treasury/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    const data = await response.json();
    return data.transaction;
  },
};