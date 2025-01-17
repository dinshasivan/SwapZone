# 🚀SwapZone


Easy token trades and liquidity provisioning are made possible by this decentralised liquidity pool contract which is built on Solidity and implemented on the Sepolia test network.



## 🧐 Features


- ERC20 Token Deployment: A customizable ERC20 token with features such as name, symbol, and initial supply.
- Liquidity Provision: Make use of Tokens A and B to introduce liquidity into the pool.
- Liquidity Pool: A smart contract to facilitate the addition of liquidity, token swaps, and liquidity removal.



## 🛠️ Getting Started

To run the project locally, follow these steps:

### Frontend Setup

1. Clone the repository:
    ```bash
    git clone git@github.com:dinshasivan/SwapZone.git
    ```
2. Navigate to the project directory:
    ```bash
    cd frontend
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Start the project:
    ```bash
    npm run dev
    ```
    
---

## Smart Contract Setup with Hardhat

To interact with the blockchain and deploy the smart contract, follow these steps:

1. Install Hardhat and the required dependencies:
    ```bash
    cd hardhat
    npm install -D hardhat @nomicfoundation/hardhat-toolbox
    ```

2. Set up your environment variables by creating a `.env` file in the root of the project with the following content:
    ```bash
    SEPOLIA_URL=your_sepolia_rpc_url
    PRIVATE_KEY=your_private_key
    ```
    
    Replace `your_sepolia_rpc_url` with your own Sepolia network URL (e.g., from Infura or Alchemy), and `your_private_key` with the private key of your Sepolia account.



3. Set Up Your Wallet
Connect your wallet (MetaMask, etc.) to the Sepolia network and get test tokens from a faucet.
## 💡 Testing on Sepolia
1. Get Test ETH from the Sepolia Faucet.
2. Mint or request test tokens (TokenA and TokenB).
3. Deploy the contract and start interacting with it!
## Tech Stack

*Client:* React, TailwindCSS

*Server:* Solidity, HARDHAT


## Screenshots

![App Screenshot](https://drive.google.com/uc?export=view&id=1tZXOKLKoTYBaqL2prhx1371I12DbyXv7)
