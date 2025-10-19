import { SomniaTestnet } from "@/config";

export function EmailTemplate({
  firstName,
  amountUSD,
  txHash,
  walletAddress,
  companyName,
}: {
  firstName: string;
  amountUSD: number;
  txHash: string;
  walletAddress: string;
  companyName: string;
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
          <div className="header">Payout Details</div>
          <div className="subheader">{companyName}</div>

          <div className="content">
            <p>Hi {firstName},</p>
            <p>
              Your payout of <strong>${amountUSD.toFixed(2)}</strong> has been processed to the wallet:
            </p>
            <p><code>{walletAddress}</code></p>
            <p>You can view the transaction here:</p>
            <p>
              <a href={`${SomniaTestnet.blockExplorers.default.url}/tx/${txHash}`} target="_blank" rel="noreferrer">
                View Transaction
              </a>
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
