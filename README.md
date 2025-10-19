# PayThree - Avalanche ESOP & Payroll Management Platform

A comprehensive blockchain-based platform for managing Employee Stock Option Plans (ESOPs) and payroll on the Avalanche network.

## 🚀 Features

### Employee Portal
- View personal ESOP grants and vesting schedules
- Track payout history and upcoming payments
- Wallet integration for Avalanche network
- Real-time balance and transaction tracking

### HR Portal
- Manage employee ESOP grants
- Process payroll and batch payments
- Treasury management and transaction history
- Employee onboarding and management

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **Blockchain**: Avalanche C-Chain, Wagmi, Viem
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Email**: Resend
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gauravsonii/PayThree.git
   cd PayThree
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   **Employee Portal:**
   ```bash
   cd employee-portal
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

   **HR Portal:**
   ```bash
   cd hr-portal
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Required Environment Variables**
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   
   # NextAuth Configuration
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your-secret-key
   
   # Avalanche Configuration
   NEXT_PUBLIC_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
   NEXT_PUBLIC_AVALANCHE_CHAIN_ID=43114
   
   # Contract Addresses
   NEXT_PUBLIC_ESOP_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_PAYROLL_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x...
   
   # Email Configuration
   RESEND_API_KEY=your-resend-api-key
   FROM_EMAIL=noreply@yourcompany.com
   ```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the Next.js applications

2. **Configure Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Set different values for Employee and HR portals

3. **Deploy**
   - Vercel will automatically deploy both applications
   - Employee Portal: `https://your-domain.vercel.app`
   - HR Portal: `https://your-domain-hr.vercel.app`

### Manual Deployment

1. **Build the applications**
   ```bash
   npm run build
   ```

2. **Start the applications**
   ```bash
   # Employee Portal (Port 3000)
   npm run start:employee
   
   # HR Portal (Port 3001)
   npm run start:hr
   ```

## 🔧 Development

### Running Locally

```bash
# Install dependencies
npm run install:all

# Start both applications in development mode
npm run dev

# Or start individually
npm run dev:employee  # Employee Portal on http://localhost:3000
npm run dev:hr        # HR Portal on http://localhost:3001
```

### Project Structure

```
paythree-avax/
├── employee-portal/          # Employee-facing application
│   ├── app/                  # Next.js 13 app directory
│   ├── components/           # React components
│   ├── lib/                  # Utility functions
│   ├── models/               # MongoDB models
│   └── utils/                # Blockchain utilities
├── hr-portal/                # HR-facing application
│   ├── app/                  # Next.js 13 app directory
│   ├── components/           # React components
│   ├── contracts/            # Smart contracts
│   ├── emailTemplates/       # Email templates
│   └── ...
└── vercel.json              # Vercel deployment configuration
```

## 🔗 Smart Contracts

The platform uses several smart contracts on Avalanche:

- **ESOPVesting.sol**: Manages ESOP grants and vesting
- **PayrollManager.sol**: Handles payroll processing
- **MockUSDC.sol**: Test USDC token for development

## 📱 Usage

### For Employees
1. Connect your Avalanche wallet
2. View your ESOP grants and vesting schedule
3. Track your payout history
4. Monitor your token balance

### For HR
1. Access the HR portal
2. Manage employee ESOP grants
3. Process payroll batches
4. Monitor treasury transactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: [Your Contact Information]

## 🔗 Links

- **Repository**: https://github.com/gauravsonii/PayThree
- **Live Demo**: [Coming Soon]
- **Documentation**: [Coming Soon]