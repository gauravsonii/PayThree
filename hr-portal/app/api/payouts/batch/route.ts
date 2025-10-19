// /pages/api/payouts/batch.ts
import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import PayoutBatch from "@/models/PayoutBatch";
import Payout from "@/models/Payout";
import TreasuryTransaction from "@/models/TreasuryTransaction";
import { Resend } from 'resend';
import { EmailTemplate } from '@/emailTemplates/payoutNotification';
import Employee from "@/models/Employee";
import Settings from "@/models/Settings";

export const dynamic = 'force-dynamic';


const resend = new Resend(process.env.RESEND_API_KEY);


async function sendEmailToEmployee(employeeId: string, name: string, email: string, amountUSD: number, txHash: string , companyName: string , walletAddress: string ) {
  try {
    // Send email asynchronously
    // console.log(`Sending email to ${walletAddress} for payout of ${amountUSD} USD`);
    await resend.emails.send({
      from: 'payout-notification@resend.dev',
      to: email,
      subject: 'Payout Notification',
      react: EmailTemplate({ firstName: name, amountUSD, txHash ,walletAddress , companyName}), // Use the inline EmailTemplate component
    });
    console.log(`Email sent to ${email}`);
  } catch (err) {
    console.error(`Failed to send email to ${email}: `, err);
  }
}



export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { txHash, payouts } = await req.json();

    const totalAmount = payouts.reduce((sum: number, p: any) => sum + p.amountUSD, 0);

    // Create PayoutBatch
    const batch = await PayoutBatch.create({ txHash, totalAmount });

    // Fetch settings for company name
    const settings = await Settings.findOne();
    const companyName = settings?.organizationName || "Your Company";

    const payoutDocs = [];

    for (const payout of payouts) {
      const { employeeId, amountUSD } = payout;

      // Fetch employee details by employeeId
      const employeeData = await Employee.findById(employeeId);

      if (employeeData) {
        const payoutDoc = {
          batchId: batch._id,
          employeeId,
          amountUSD: Math.round(amountUSD),
          status: "completed",
        };
        payoutDocs.push(payoutDoc);

        // Send email notification asynchronously
        sendEmailToEmployee(
          employeeId,
          employeeData.name,
          employeeData.email,
          payoutDoc.amountUSD,
          txHash,
          companyName,
          employeeData.walletAddress
        );
      }
    }

    // Insert payouts into the database
    await Payout.insertMany(payoutDocs);

    // Create Treasury Transaction
    await TreasuryTransaction.create({
      type: "withdrawal",
      amount: totalAmount,
      currency: "USD",
      description: `Payout batch ${batch._id} - ${payouts.length} employee(s) paid out`,
      txHash,
      status: "completed",
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