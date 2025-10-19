export function ESOPGrantEmailTemplate({
  firstName,
  companyName,
  totalTokens,
  durationMonths,
  cliffMonths,
  startDate,
  employeePortalUrl,
}: {
  firstName: string;
  companyName: string;
  totalTokens: number;
  durationMonths: number;
  cliffMonths: number;
  startDate: string;
  employeePortalUrl: string;
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
            ul {
              padding-left: 20px;
            }
          `}
        </style>
      </head>
      <body>
        <div className="email-container">
          <div className="header">Congratulations from {companyName}!</div>
          <div className="subheader">You’ve Been Granted an ESOP</div>

          <div className="content">
            <p>Hi {firstName},</p>
            <p>
              We are thrilled to inform you that you’ve been granted an{" "}
              <strong>Employee Stock Option Plan (ESOP)</strong> as part of our
              commitment to rewarding your contributions at{" "}
              <strong>{companyName}</strong>.
            </p>
            <p>Here are your ESOP details:</p>
            <ul>
              <li><strong>Total Tokens:</strong> {totalTokens}</li>
              <li><strong>Vesting Duration:</strong> {durationMonths} months</li>
              <li><strong>Cliff Period:</strong> {cliffMonths} months</li>
              <li><strong>Start Date:</strong> {startDate}</li>
            </ul>
            <p>
              You can track your vesting progress, token unlocks, and other
              benefits anytime via your{" "}
              <a href={employeePortalUrl} target="_blank" rel="noreferrer">
                Employee Portal
              </a>.
            </p>
            <p>
              If you have any questions about your ESOP, please contact HR or
              your reporting manager.
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
