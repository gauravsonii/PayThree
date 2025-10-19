import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Esop from "@/models/Esop";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const esop = await Esop.create(data);
    return NextResponse.json({ success: true, esop });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const esops = await Esop.find().populate('employeeId', 'name designation');
    return NextResponse.json({ success: true, esops });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
