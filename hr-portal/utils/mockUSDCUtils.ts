import { readContract, writeContract } from '@wagmi/core';
import { config } from "@/config";
import { mockUSDCABI } from './abis';
import { MOCK_USDC_ADDRESS, PAYROLL_CONTRACT_ADDRESS } from './addresses';
import { formatUnits } from 'viem';

// Get balance of an address
export async function getBalance(address: string): Promise<string> {
  try {
    const balance: any = await readContract(config, {
      abi: mockUSDCABI,
      address: MOCK_USDC_ADDRESS,
      functionName: 'balanceOf',
      args: [address],
    });
    return balance.toString();
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
}

// Get treasury balance (MockUSDC.balanceOf(payrollManagerAddress))
export async function getTreasuryBalance(): Promise<string> {
  return await getBalance(PAYROLL_CONTRACT_ADDRESS);
}

// Get treasury balance in USD (assuming 6 decimals for USDC)
export async function getTreasuryBalanceUSD(): Promise<number> {
  try {
    const balance = await getTreasuryBalance();

    console.log(balance);
    // Convert from wei to USD (assuming 6 decimals for USDC)
    return Number(formatUnits(BigInt(balance), 6));;
  } catch (error) {
    console.error('Error getting treasury balance in USD:', error);
    return 0;
  }
}

// Transfer USDC tokens
export async function transferUSDC(to: string, amount: string): Promise<any> {
  try {
    return await writeContract(config, {
      abi: mockUSDCABI,
      address: MOCK_USDC_ADDRESS,
      functionName: 'transfer',
      args: [to, BigInt(amount)],
    });
  } catch (error) {
    console.error('Error transferring USDC:', error);
    throw error;
  }
}

// Approve USDC tokens
export async function approveUSDC(spender: string, amount: string): Promise<any> {
  try {
    return await writeContract(config, {
      abi: mockUSDCABI,
      address: MOCK_USDC_ADDRESS,
      functionName: 'approve',
      args: [spender, BigInt(amount)],
    });
  } catch (error) {
    console.error('Error approving USDC:', error);
    throw error;
  }
}

// Get allowance
export async function getAllowance(owner: string, spender: string): Promise<string> {
  try {
    const allowance: any = await readContract(config, {
      abi: mockUSDCABI,
      address: MOCK_USDC_ADDRESS,
      functionName: 'allowance',
      args: [owner, spender],
    });
    return allowance.toString();
  } catch (error) {
    console.error('Error getting allowance:', error);
    return '0';
  }
} 