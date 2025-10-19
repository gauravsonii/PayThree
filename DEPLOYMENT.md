# PayThree Deployment Guide

## Quick Deployment to Vercel

### Option 1: Deploy Employee Portal
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository: `https://github.com/gauravsonii/PayThree.git`
3. Set the **Root Directory** to `employee-portal`
4. Configure Environment Variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_random_secret_key
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXT_PUBLIC_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=noreply@yourcompany.com
   ```
5. Deploy!

### Option 2: Deploy HR Portal
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository: `https://github.com/gauravsonii/PayThree.git`
3. Set the **Root Directory** to `hr-portal`
4. Configure the same environment variables as above
5. Deploy!

### Option 3: Deploy Both (Recommended)
1. Deploy Employee Portal first (follow Option 1)
2. Deploy HR Portal as a separate project (follow Option 2)
3. Update the URLs in each portal to reference the other

## Environment Variables Required

### Required Variables:
- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_SECRET`: Random secret for authentication
- `NEXTAUTH_URL`: Your deployed app URL

### Optional Variables:
- `RESEND_API_KEY`: For email notifications
- `FROM_EMAIL`: Email address for notifications
- `NEXT_PUBLIC_AVALANCHE_RPC_URL`: Avalanche RPC endpoint
- `NEXT_PUBLIC_ESOP_CONTRACT_ADDRESS`: ESOP contract address
- `NEXT_PUBLIC_PAYROLL_CONTRACT_ADDRESS`: Payroll contract address
- `NEXT_PUBLIC_USDC_CONTRACT_ADDRESS`: USDC contract address

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/gauravsonii/PayThree.git
   cd PayThree
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` in both `employee-portal` and `hr-portal`
   - Update the values as needed

4. Run development servers:
   ```bash
   # Employee Portal (port 3000)
   npm run dev:employee
   
   # HR Portal (port 3001)
   npm run dev:hr
   ```

## Troubleshooting 404 Errors

1. **Check Root Directory**: Make sure Vercel is pointing to the correct directory (`employee-portal` or `hr-portal`)
2. **Check Build Output**: Ensure the build completes successfully
3. **Check Environment Variables**: All required variables must be set
4. **Check MongoDB Connection**: Ensure MongoDB is accessible from Vercel
5. **Check API Routes**: Verify that API routes are properly configured

## Database Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it to your environment variables

## Smart Contract Deployment

1. Deploy contracts to Avalanche C-Chain
2. Update contract addresses in environment variables
3. Ensure contracts are properly configured

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are set
3. Ensure MongoDB is accessible
4. Check that all dependencies are installed correctly
