
export function OnboardingEmailTemplate({
  firstName,
  walletAddress,
  companyName,
  employeePortalUrl,
  designation,
  salaryUSD,
}: {
  firstName: string;
  walletAddress: string;
  companyName: string;
  employeePortalUrl: string;
  designation: string;
    salaryUSD: number;
}) {
  return (
    <html>
      <head>
        <style>
          {`
            body {
              font-family: Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 24px;
              border-radius: 8px;
              border: 1px solid #e0e0e0;
            }
            .header {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              color: #2e7d32; /* green */
              margin-bottom: 10px;
            }
            .subheader {
              text-align: center;
              font-size: 16px;
              color: #4caf50; /* lighter green */
              margin-bottom: 20px;
            }
            .content {
              font-size: 16px;
              line-height: 1.6;
              color: #444;
            }
            .footer {
              margin-top: 30px;
              font-size: 13px;
              text-align: center;
              color: #777;
              border-top: 1px solid #eee;
              padding-top: 16px;
            }
            a {
              color: #388e3c; /* link green */
              text-decoration: none;
            }
            code {
              background: #e8f5e9;
              color: #1b5e20;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 14px;
            }
          `}
        </style>
      </head>
      <body>
        <div className="email-container">
          <div className="header">Welcome to {companyName}</div>
          <div className="subheader">Your Payment System Access Is Ready</div>

          <div className="content">
            <p>Hi {firstName},</p>
              <p>
              We’re excited to welcome you to <strong>{companyName}</strong> as{" "}
              <strong>{designation || "our newest team member"}</strong>!  
              You’ve been successfully added to our employee payment system.
            </p>
            {salaryUSD && (
              <p>
                Your <strong>monthly payout</strong> has been set to{" "}
                <strong>${salaryUSD.toLocaleString()}</strong>.
              </p>
            )}
            <p>
              The wallet you’ve registered with us is:
            </p>
            <p><code>{walletAddress}</code></p>
            <p>
              You can now access your <strong>Employee Portal</strong> to track:
              <ul>
                <li>Your ESOP allocations</li>
                <li>Payout history</li>
                <li>Other employment-related details</li>
              </ul>
            </p>
            <p>
              Access the portal here:{" "}
              <a href={employeePortalUrl} target="_blank" rel="noreferrer">
                Employee Portal
              </a>
            </p>
            <p>
              If you notice any incorrect information, please contact our HR team immediately so we can make the necessary adjustments.
            </p>
          </div>

          <div className="footer">
            <p>&copy; 2025 {companyName}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  );
}
