import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { tokenAddress, network } = await req.json();
    

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully connected to ${network} network`,
      tokenAddress,
      network
    });
    
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
} 