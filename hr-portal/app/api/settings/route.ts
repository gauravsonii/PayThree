import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await Settings.create({});
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    
    // Find existing settings or create new ones
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create new settings with provided data and defaults
      settings = await Settings.create(data);
    } else {
      // Update existing settings
      settings = await Settings.findOneAndUpdate(
        { _id: settings._id },
        { $set: data },
        { new: true, runValidators: true }
      );
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
} 