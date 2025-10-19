import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TreasuryTransaction from '@/models/TreasuryTransaction';

export const dynamic = 'force-dynamic';

// Get all treasury transactions
export async function GET() {
  try {
    await connectDB();
    const transactions = await TreasuryTransaction.find({})
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching treasury transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treasury transactions' },
      { status: 500 }
    );
  }
}

// Create a new treasury transaction
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { type, amount, description, txHash, status, userId, walletAddress } = await req.json();

    const transaction = await TreasuryTransaction.create({
      type,
      amount,
      description,
      txHash,
      status,
      userId,
      walletAddress,
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating treasury transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create treasury transaction' },
      { status: 500 }
    );
  }
} 