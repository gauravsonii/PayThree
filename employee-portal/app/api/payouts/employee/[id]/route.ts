import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Payout from "@/models/Payout";
import PayoutBatch from "@/models/PayoutBatch";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    // Ensure both models are registered
    const PayoutModel = mongoose.models.Payout || mongoose.model("Payout", Payout.schema);
    const PayoutBatchModel = mongoose.models.PayoutBatch || mongoose.model("PayoutBatch", PayoutBatch.schema);
    
    const payouts = await PayoutModel.find({ employeeId: params.id })
      .populate("batchId")
      .sort({ createdAt: -1 });
    return NextResponse.json(payouts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch employee payouts" }, { status: 500 });
  }
}
