import {  writeContract } from '@wagmi/core';
import { config } from "@/config";
import { payrollContractABI , mockUSDCABI} from './abis';
import { PAYROLL_CONTRACT_ADDRESS ,MOCK_USDC_ADDRESS} from './addresses';

function normalizeProxyData(data: any): any {
  return JSON.parse(
    JSON.stringify(data, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
  );
}


// Treasury Functions

// Fund the treasury (payroll manager contract)
export async function fundTreasury(amount: string): Promise<any> {
  try {
    return await writeContract(config, {
      abi: payrollContractABI,
      address: PAYROLL_CONTRACT_ADDRESS,
      functionName: 'fundContract',
      args: [BigInt(amount)],
    });
  } catch (error) {
    console.error('Error funding treasury:', error);
    throw error;
  }
}

// Withdraw from treasury
export async function withdrawFromTreasury(amount: string): Promise<any> {
  try {
    return await writeContract(config, {
      abi: payrollContractABI,
      address: PAYROLL_CONTRACT_ADDRESS,
      functionName: 'withdraw',
      args: [BigInt(amount)],
    });
  } catch (error) {
    console.error('Error withdrawing from treasury:', error);
    throw error;
  }
}

// Batch pay employees
export async function batchPayEmployees(employees: string[], amounts: string[]): Promise<any> {
  try {
    return await writeContract(config, {
      abi: payrollContractABI,
      address: PAYROLL_CONTRACT_ADDRESS,
      functionName: 'batchPay',
      args: [employees, amounts.map(amount => BigInt(amount))],
    });
  } catch (error) {
    console.error('Error batch paying employees:', error);
    throw error;
  }
} 

// Combined approve + fund
export async function fundTreasuryWithApprove(amount: string): Promise<any> {
  try {
    const bigAmount = BigInt(amount);

    // 1. Approve the PayrollManager to spend tokens
    await writeContract(config, {
      abi: mockUSDCABI,
      address: MOCK_USDC_ADDRESS,
      functionName: 'approve',
      args: [PAYROLL_CONTRACT_ADDRESS, bigAmount],
    });

    // 2. Fund the treasury
    return await writeContract(config, {
      abi: payrollContractABI,
      address: PAYROLL_CONTRACT_ADDRESS,
      functionName: 'fundContract',
      args: [bigAmount],
    });

  } catch (error) {
    console.error('Error funding treasury with approve:', error);
    throw error;
  }
}