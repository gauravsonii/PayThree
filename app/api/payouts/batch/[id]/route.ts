import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Payout from "@/models/Payout";
import Employee from "@/models/Employee"; // Register Employee schema

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // Await params
  await connectDB();
  const payouts = await Payout.find({ batchId: id }).populate("employeeId");
  return NextResponse.json(payouts);
}
