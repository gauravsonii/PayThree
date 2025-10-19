# PayThree - Employee Payout Management

A comprehensive HR dashboard for managing employee payouts and ESOPs with Ethereum wallet integration.

## Features

- **Wallet Connection Required**: Users must connect their Ethereum wallet to access the application
- **Employee Management**: Add, view, and manage employee information
- **ESOP Management**: Grant and track employee stock option plans
- **Payout Processing**: Process batch payouts to employees
- **Settings Management**: Configure organization settings and token addresses
- **Dark Theme**: Modern, easy-on-the-eyes dark interface with leaf green accents

## Prerequisites

- **MetaMask**: Users must have MetaMask installed in their browser
- **Ethereum Wallet**: Users need an Ethereum wallet with some ETH for gas fees
- **Ethereum Mainnet**: The application requires connection to Ethereum mainnet

## Getting Started

1. **Install MetaMask**: Download and install MetaMask from [metamask.io](https://metamask.io)

2. **Set up your wallet**: 
   - Create a new wallet or import an existing one
   - Ensure you have some ETH for gas fees
   - Make sure you're connected to Ethereum mainnet

3. **Access the application**:
   - Open the application in your browser
   - Click "Connect MetaMask" when prompted
   - Approve the connection in MetaMask
   - The application will automatically switch to Ethereum mainnet if needed

## Wallet Connection

The application requires wallet connection for security and to enable blockchain-based features:

- **Secure Connection**: All wallet interactions are encrypted and secure
- **Network Validation**: Automatically ensures connection to Ethereum mainnet
- **Address Display**: Shows your connected wallet address in the top-right corner
- **Disconnect Option**: Users can disconnect their wallet at any time

## Features Overview

### Dashboard
- Overview of employee statistics
- Recent employee activity
- Recent payout batches
- Quick access to key metrics

### Employees
- Add new employees with blockchain addresses
- View employee directory
- Select employees for batch payouts
- Manage employee information

### ESOPs
- Grant employee stock options
- Track vesting schedules
- Monitor vesting progress
- View ESOP statistics

### Payouts
- Process batch payouts
- View payout history
- Track transaction status
- Monitor payout statistics

### Settings
- Configure organization settings
- Set token contract addresses
- Manage API configurations
- Configure automation preferences

## Technical Details

- **Frontend**: Next.js 13 with App Router
- **UI Components**: Shadcn UI with Tailwind CSS
- **Wallet Integration**: Direct MetaMask integration
- **Database**: MongoDB with Mongoose
- **Styling**: Custom dark theme with leaf green accents

## Security

- Wallet connection is required for all operations
- All blockchain interactions are secure
- User data is protected and encrypted
- No sensitive information is stored without user consent

## Support

If you encounter issues with wallet connection:

1. Ensure MetaMask is installed and unlocked
2. Check that you're connected to Ethereum mainnet
3. Try refreshing the page and reconnecting
4. Ensure you have sufficient ETH for gas fees

## Development

To run the application locally:

```bash
npm install
npm run dev
```

Make sure to set up your environment variables and MongoDB connection. 