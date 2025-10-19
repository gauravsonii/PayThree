import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { Resend } from "resend";
import { OnboardingEmailTemplate } from "@/emailTemplates/onboardingNotification";
import Settings from "@/models/Settings";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOnboardingEmail({
  name,
  email,
  walletAddress,
  companyName,
  employeePortalUrl,
  designation,
  salaryUSD,
}: {
  name: string;
  email: string;
  walletAddress: string;
  companyName: string;
  employeePortalUrl: string;
  designation: string; 
  salaryUSD: number;
}) {
  try {
    console.log(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: `Welcome to ${companyName}!`,
      react: OnboardingEmailTemplate({
        firstName: name,
        walletAddress,
        companyName,
        employeePortalUrl,
        designation,
        salaryUSD
      }),
    });
    console.log(`Onboarding email sent to ${email}`);
  } catch (err) {
    console.error(`Failed to send onboarding email to ${email}:`, err);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const employee = await Employee.create(data);
      const settings = await Settings.findOne();
    const companyName = settings?.organizationName || "Your Company";

    // Send onboarding email after successful creation
    await sendOnboardingEmail({
      name: employee.name,
      email: employee.email,
      walletAddress: employee.walletAddress,
      companyName: companyName,
      employeePortalUrl: `${process.env.BASE_URL}`, 
      designation: employee.designation,
      salaryUSD: employee.salaryUSD,
    });

    return NextResponse.json({ success: true, employee });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const employees = await Employee.find();
    return NextResponse.json({ success: true, employees });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
