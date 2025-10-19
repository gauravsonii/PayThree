import { readContract, writeContract } from '@wagmi/core';
import { config } from "../config";
import { esopsContractABI } from './abis';
import { ESOP_CONTRACT_ADDRESS } from './addresses';

function normalizeProxyData(data: any): any {
  return JSON.parse(
    JSON.stringify(data, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
  );
}

// ESOP Contract Functions

// Add employee to ESOP program
export async function addEmployeeToESOP(
  employeeAddress: string,
  startTime: number,
  cliffMonths: number,
  vestingMonths: number,
  tokenAmount: string
): Promise<any> {
  try {
    return await writeContract(config, {
      abi: esopsContractABI,
      address: ESOP_CONTRACT_ADDRESS,
      functionName: 'addEmployee',
      args: [
        employeeAddress,
        BigInt(startTime),
        BigInt(cliffMonths),
        BigInt(vestingMonths)
      ],
      value: BigInt(tokenAmount),
    });
  } catch (error) {
    console.error('Error adding employee to ESOP:', error);
    throw error;
  }
}

// Remove employee from ESOP program
export async function removeEmployeeFromESOP(employeeAddress: string): Promise<any> {
  try {
    return await writeContract(config, {
      abi: esopsContractABI,
      address: ESOP_CONTRACT_ADDRESS,
      functionName: 'removeEmployee',
      args: [employeeAddress],
    });
  } catch (error) {
    console.error('Error removing employee from ESOP:', error);
    throw error;
  }
}

// Claim vested tokens (for employees)
export async function claimVestedTokens(): Promise<any> {
  try {
    return await writeContract(config, {
      abi: esopsContractABI,
      address: ESOP_CONTRACT_ADDRESS,
      functionName: 'claim',
    });
  } catch (error) {
    console.error('Error claiming vested tokens:', error);
    throw error;
  }
}

// Get vested amount for an employee
export async function getVestedAmount(employeeAddress: string): Promise<string> {
  try {
    const result: any = await readContract(config, {
      abi: esopsContractABI,
      address: ESOP_CONTRACT_ADDRESS,
      functionName: 'vestedAmount',
      args: [employeeAddress],
    });
    return result.toString();
  } catch (error) {
    console.error('Error getting vested amount:', error);
    throw error;
  }
}

// Get vesting details for an employee
export async function getEmployeeVesting(employeeAddress: string): Promise<any> {
  try {
    const result: any = await readContract(config, {
      abi: esopsContractABI,
      address: ESOP_CONTRACT_ADDRESS,
      functionName: 'vestings',
      args: [employeeAddress],
    });
    return normalizeProxyData(result);
  } catch (error) {
    console.error('Error getting employee vesting:', error);
    throw error;
  }
}

// Get all vestings (employees and their vesting schedules)
export async function getAllVestings(): Promise<any> {
  try {
    const result: any = await readContract(config, {
      abi: esopsContractABI,
      address: ESOP_CONTRACT_ADDRESS,
      functionName: 'getAllVestings',
    });
    return normalizeProxyData(result);
  } catch (error) {
    console.error('Error getting all vestings:', error);
    throw error;
  }
}

// Get employee list
export async function getEmployeeList(): Promise<string[]> {
  try {
    const result: any = await readContract(config, {
      abi: esopsContractABI,
      address: ESOP_CONTRACT_ADDRESS,
      functionName: 'employeeList',
      args: [0], // Start from index 0
    });
    
    // Since employeeList is an array, we need to iterate to get all employees
    const employees: string[] = [];
    let index = 0;
    
    while (true) {
      try {
        const employee: any = await readContract(config, {
          abi: esopsContractABI,
          address: ESOP_CONTRACT_ADDRESS,
          functionName: 'employeeList',
          args: [BigInt(index)],
        });
        
        if (employee === '0x0000000000000000000000000000000000000000') {
          break; // End of list
        }
        
        employees.push(employee);
        index++;
      } catch {
        break; // No more employees
      }
    }
    
    return employees;
  } catch (error) {
    console.error('Error getting employee list:', error);
    throw error;
  }
}

// Get contract owner
export async function getESOPContractOwner(): Promise<string> {
  try {
    const result: any = await readContract(config, {
      abi: esopsContractABI,
      address: ESOP_CONTRACT_ADDRESS,
      functionName: 'owner',
    });
    return result;
  } catch (error) {
    console.error('Error getting ESOP contract owner:', error);
    throw error;
  }
}

// Helper function to calculate vesting schedule
export function calculateVestingSchedule(
  totalAmount: number,
  startTime: number,
  cliffMonths: number,
  vestingMonths: number,
  currentTime: number
): {
  vestedAmount: number;
  unvestedAmount: number;
  cliffReached: boolean;
  fullyVested: boolean;
} {
  const cliffTime = startTime + (cliffMonths * 30 * 24 * 60 * 60); // Convert months to seconds
  const vestingEndTime = startTime + (vestingMonths * 30 * 24 * 60 * 60);
  
  let vestedAmount = 0;
  let cliffReached = currentTime >= cliffTime;
  let fullyVested = currentTime >= vestingEndTime;
  
  if (currentTime < cliffTime) {
    // Before cliff, no tokens vested
    vestedAmount = 0;
  } else if (currentTime >= vestingEndTime) {
    // After vesting period, all tokens vested
    vestedAmount = totalAmount;
  } else {
    // During vesting period, calculate linear vesting
    const vestingProgress = (currentTime - cliffTime) / (vestingEndTime - cliffTime);
    vestedAmount = Math.floor(totalAmount * vestingProgress);
  }
  
  return {
    vestedAmount,
    unvestedAmount: totalAmount - vestedAmount,
    cliffReached,
    fullyVested
  };
}

// Helper function to convert wei to ETH
export function weiToEth(wei: number | string): number {
  const weiNumber = typeof wei === 'string' ? Number(wei) : wei;
  return weiNumber / Math.pow(10, 18);
}

// Helper function to convert ETH to wei
export function ethToWei(eth: number): string {
  return (eth * Math.pow(10, 18)).toString();
}

// Helper function to format vesting data for display
export function formatVestingData(vestingData: any): any {
  if (!vestingData) return null;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const secondsInMonth = 30 * 24 * 60 * 60;

  const schedule = calculateVestingSchedule(
    Number(vestingData.totalAmount),
    Number(vestingData.start),
    (Number(vestingData.cliff) - Number(vestingData.start))/secondsInMonth,
    Number(vestingData.duration)/secondsInMonth,
    currentTime
  );
  
  return {
    ...vestingData,
    ...schedule,
    totalAmount: Number(vestingData.totalAmount),
    claimed: Number(vestingData.claimed),
    start: Number(vestingData.start),
    cliff: (Number(vestingData.cliff) - Number(vestingData.start))/secondsInMonth,
    duration: Number(vestingData.duration)/secondsInMonth,
    claimableAmount: schedule.vestedAmount - Number(vestingData.claimed)
  };
} 