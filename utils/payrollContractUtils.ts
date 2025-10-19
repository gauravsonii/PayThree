import { readContract, writeContract } from '@wagmi/core';
import { config } from "@/config";
import { payrollContractABI , mockUSDCABI} from './abis';
import { PAYROLL_CONTRACT_ADDRESS ,MOCK_USDC_ADDRESS} from './addresses';

function normalizeProxyData(data: any): any {
  return JSON.parse(
    JSON.stringify(data, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
  );
}

// Get submission fee
export async function getSubmissionFee(): Promise<string> {
  const fee: any = await readContract(config, {
    abi: payrollContractABI,
    address: PAYROLL_CONTRACT_ADDRESS,
    functionName: 'SUBMISSION_FEE',
  });
  return fee.toString();
}

// Submit music
export async function submitMusic(musicUrl: string, theme: string, prompt: string): Promise<any> {
  const submissionFee: any = await getSubmissionFee();
  return await writeContract(config, {
    abi: payrollContractABI,
    address: PAYROLL_CONTRACT_ADDRESS,
    functionName: 'submitMusic',
    args: [musicUrl, theme, prompt],
    value: BigInt(submissionFee),
  });
}

// Get contest submissions
export async function getContestDetails(): Promise<any[]> {
  const result: any = await readContract(config, {
    abi: payrollContractABI,
    address: PAYROLL_CONTRACT_ADDRESS,
    functionName: 'getSubmissions',
  });

  return normalizeProxyData(result);
}

// Get winners
export async function getWinners(): Promise<any[]> {
  const result: any = await readContract(config, {
    abi: payrollContractABI,
    address: PAYROLL_CONTRACT_ADDRESS,
    functionName: 'getWinners',
  });

  console.log("Winners: ", normalizeProxyData(result));

  return normalizeProxyData(result);
}

// Vote on submission
export async function voteOnSubmission(submissionIndex: number): Promise<any> {
  return await writeContract(config, {
    abi: payrollContractABI,
    address: PAYROLL_CONTRACT_ADDRESS,
    functionName: 'vote',
    args: [submissionIndex],
  });
}

// Get current theme
export async function getCurrentTheme(): Promise<string> {
  const result: any = await readContract(config, {
    abi: payrollContractABI,
    address: PAYROLL_CONTRACT_ADDRESS,
    functionName: 'currentTheme',
  });

  return result;
}

// Mint music NFT
export async function mintMusicNFT(winnerIndex: number, uri: string): Promise<any> {
  return await writeContract(config, {
    abi: payrollContractABI,
    address: PAYROLL_CONTRACT_ADDRESS,
    functionName: 'mintMusicNFT',
    args: [winnerIndex, uri],
  });
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