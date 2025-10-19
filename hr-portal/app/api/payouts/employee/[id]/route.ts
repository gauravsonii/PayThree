import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Payout from "@/models/Payout";

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const payouts = await Payout.find({ employeeId: params.id })
      .populate("batchId")
      .sort({ createdAt: -1 });
    return NextResponse.json(payouts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch employee payouts" }, { status: 500 });
  }
}
