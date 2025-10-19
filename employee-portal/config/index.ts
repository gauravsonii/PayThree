import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { avalancheFuji} from 'wagmi/chains'
// import { Chain } from 'wagmi'

// Load env
export const projectId = "24b5b5fcdfb84a1f883c372ea5991e50";

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const SomniaTestnet = {
 
  blockExplorers: {
    default: {
      name: 'Avalanche Testnet Explorer',
      url: 'https://testnet.snowtrace.io/',
    },
  },
}

export const network = avalancheFuji
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  networks: [network],
  projectId,
})

// Export Wagmi config
export const config = wagmiAdapter.wagmiConfig
