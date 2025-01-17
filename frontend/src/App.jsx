import React, { useState } from "react";
import { ethers } from "ethers";
import tokenAAbi from "./assets/ABI/TokenA.json";
import tokenBAbi from "./assets/ABI/TokenB.json";
import liquidityPoolAbi from "./assets/ABI/SimpleLiquidityPool.json";
import contractAddress from "./assets/ABI/deployed_addresses.json";

const tokenAAddress = contractAddress["TokenModule#TokenA"];
const tokenBAddress = contractAddress["TokenModule#TokenB"];
const liquidityPoolAddress = contractAddress["LiquidityModule#SimpleLiquidityPool"];

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [liquidityAmount, setLiquidityAmount] = useState("");

  const connectToMetamask = async () => {
    try {
      if (window.ethereum) {
        const providerInstance = new ethers.BrowserProvider(window.ethereum);
        await providerInstance.send("eth_requestAccounts", []);
        const signerInstance = await providerInstance.getSigner();
        const accounts = await signerInstance.getAddress();

        setProvider(providerInstance);
        setSigner(signerInstance);
        setAccount(accounts);

        alert(`Connected account: ${accounts}`);
      } else {
        alert("MetaMask is not installed.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect to MetaMask.");
    }
  };

  const getContractInstance = (address, abi) => {
    if (!signer) {
      alert("Signer not available. Please connect to MetaMask first.");
      return null;
    }
    return new ethers.Contract(address, abi, signer);
  };

  const handleAddLiquidity = async () => {
    if (!amountA || !amountB || isNaN(amountA) || isNaN(amountB)) {
      alert("Please enter valid amounts for TokenA and TokenB.");
      return;
    }

    try {
      const tokenA = getContractInstance(tokenAAddress, tokenAAbi.abi);
      const tokenB = getContractInstance(tokenBAddress, tokenBAbi.abi);
      const liquidityPool = getContractInstance(liquidityPoolAddress, liquidityPoolAbi.abi);

      if (!tokenA || !tokenB || !liquidityPool) return;

      await tokenA.approve(liquidityPoolAddress, ethers.parseEther(amountA)).then(tx => tx.wait());
      await tokenB.approve(liquidityPoolAddress, ethers.parseEther(amountB)).then(tx => tx.wait());

      await liquidityPool.addLiquidity(
        ethers.parseEther(amountA),
        ethers.parseEther(amountB)
      ).then(tx => tx.wait());

      alert("Liquidity added successfully!");
    } catch (error) {
      console.error("Error adding liquidity:", error);
      alert("Failed to add liquidity.");
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!liquidityAmount || isNaN(liquidityAmount)) {
      alert("Please enter a valid liquidity amount.");
      return;
    }

    try {
      const liquidityPool = getContractInstance(liquidityPoolAddress, liquidityPoolAbi.abi);

      if (!liquidityPool) return;

      // You can remove liquidity by specifying how much to withdraw
      await liquidityPool.removeLiquidity(
        ethers.parseEther(liquidityAmount, 18)
      ).then(tx => tx.wait());

      alert("Liquidity removed successfully!");
      setLiquidityAmount("");
    } catch (error) {
      console.error("Error removing liquidity:", error);
      alert("Failed to remove liquidity.");
    }
  };

  const handleSwap = async () => {
    if (!inputToken || !inputAmount || isNaN(inputAmount)) {
      alert("Please select a token and enter a valid input amount.");
      return;
    }

    try {
      const inputContract = getContractInstance(
        inputToken === "TokenA" ? tokenAAddress : tokenBAddress,
        inputToken === "TokenA" ? tokenAAbi.abi : tokenBAbi.abi
      );
      const liquidityPool = getContractInstance(liquidityPoolAddress, liquidityPoolAbi.abi);

      if (!inputContract || !liquidityPool) return;

      await inputContract.approve(liquidityPoolAddress, ethers.parseUnits(inputAmount, 18)).then(tx => tx.wait());
      await liquidityPool.swap(
        inputToken === "TokenA" ? tokenAAddress : tokenBAddress,
        ethers.parseUnits(inputAmount, 18)
      ).then(tx => tx.wait());

      alert("Token swapped successfully!");
      setInputAmount("");
    } catch (error) {
      console.error("Error swapping tokens:", error);
      alert("Failed to swap tokens.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          SwapZone
        </h1>

        {!account ? (
          <button
            onClick={connectToMetamask}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Connect to MetaMask
          </button>
        ) : (
          <p className="text-center text-gray-700 mb-6">
            Connected Account: <span className="font-medium">{account}</span>
          </p>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Liquidity</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Amount of TokenA"
              value={amountA}
              onChange={(e) => setAmountA(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Amount of TokenB"
              value={amountB}
              onChange={(e) => setAmountB(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleAddLiquidity}
              disabled={!account}
              className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Liquidity
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Remove Liquidity</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Liquidity Amount"
              value={liquidityAmount}
              onChange={(e) => setLiquidityAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleRemoveLiquidity}
              disabled={!account}
              className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove Liquidity
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Swap Tokens</h2>
          <div className="space-y-4">
            <select
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Token</option>
              <option value="TokenA">TokenA</option>
              <option value="TokenB">TokenB</option>
            </select>
            <input
              type="text"
              placeholder="Input Amount"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSwap}
              disabled={!account}
              className="w-full py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
