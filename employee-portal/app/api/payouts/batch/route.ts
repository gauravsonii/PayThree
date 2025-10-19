// /pages/api/payouts/batch.ts
import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import PayoutBatch from "@/models/PayoutBatch";
import Payout from "@/models/Payout";
import TreasuryTransaction from "@/models/TreasuryTransaction";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { txHash, payouts } = await req.json();

    const totalAmount = payouts.reduce((sum: number, p: any) => sum + p.amountUSD, 0);
    const batch = await PayoutBatch.create({ txHash, totalAmount });

    const payoutDocs = payouts.map((p: any) => ({
      batchId: batch._id,
      employeeId: p.employeeId,
      amountUSD: p.amountUSD,
      status: "completed"
    }));
    await Payout.insertMany(payoutDocs);

    // Create treasury transaction for the payout batch
    await TreasuryTransaction.create({
      type: 'withdrawal',
      amount: totalAmount,
      currency: 'USD',
      description: `Payout batch ${batch._id} - ${payouts.length} employee(s) paid out`,
      txHash: txHash,
      status: 'completed'
    });

    return NextResponse.json({ batch, payouts: payoutDocs }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create payout batch" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const batches = await PayoutBatch.find().sort({ createdAt: -1 });
  return NextResponse.json(batches);
}