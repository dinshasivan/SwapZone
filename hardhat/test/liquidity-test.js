const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers')

describe('SimpleLiquidityPool', function () {
  async function deployContract() {
    const [owner, addr1] = await ethers.getSigners();

    // Deploy TokenA
    const TokenA = await ethers.getContractFactory('TokenA');
    const tokenA = await TokenA.deploy();
    await tokenA.waitForDeployment(); // Ensure deployment is complete

    // Deploy TokenB
    const TokenB = await ethers.getContractFactory('TokenB');
    const tokenB = await TokenB.deploy();
    await tokenB.waitForDeployment(); // Ensure deployment is complete

    // Deploy LiquidityPool 
    const LiquidityPoolFactory = await ethers.getContractFactory('SimpleLiquidityPool');
    const liquidityPool = await LiquidityPoolFactory.deploy(await tokenA.getAddress(), await tokenB.getAddress());
    await liquidityPool.waitForDeployment(); // Ensure deployment is complete

    return { owner, addr1, tokenA, tokenB, liquidityPool };
  }

  it("should deploy the liquidity pool", async function () {
    const { liquidityPool } = await loadFixture(deployContract);
    console.log(liquidityPool.target);

    // expect(liquidityPool.address).to.be.properAddress; 
  });

  it("should perform a token swap", async function () {
    const { owner, addr1, tokenA, tokenB, liquidityPool } = await loadFixture(deployContract);
    console.log(addr1.address);

    const initialAmountA = ethers.parseEther("100");
    const initialAmountB = ethers.parseEther("100");
    const swapAmount = ethers.parseEther("10");

    await tokenA.mint(addr1.address, initialAmountA);
    console.log(await tokenA.balanceOf(addr1.address));

    await tokenB.mint(addr1.address, initialAmountB);
    console.log(await tokenB.balanceOf(addr1.address));

    const tokenAWithAddr1 = tokenA.connect(addr1);
    const tokenBWithAddr1 = tokenB.connect(addr1);
    const liquidityPoolWithAddr1 = liquidityPool.connect(addr1);

    await tokenAWithAddr1.approve(await liquidityPool.getAddress(), initialAmountA);
    await tokenBWithAddr1.approve(await liquidityPool.getAddress(), initialAmountB);
    
    const allowance = await tokenAWithAddr1.allowance(addr1.address, liquidityPool.target)
    console.log(`Allowance A: ${allowance.toString()}`);

    const allowanceB = await tokenBWithAddr1.allowance(addr1.address, liquidityPool.target)
    console.log(`Allowance B: ${allowanceB.toString()}`);
    

    // Add liquidity
    await liquidityPoolWithAddr1.addLiquidity(swapAmount, initialAmountB);

    // Perform token swap (TokenA -> TokenB)
    const tokenBBalanceBefore = await tokenB.balanceOf(await addr1.getAddress());
    await liquidityPoolWithAddr1.swap(await tokenA.getAddress(), swapAmount);
    const tokenBBalanceAfter = await tokenB.balanceOf(await addr1.getAddress());

    // Validate swap
    expect(tokenBBalanceAfter).to.be.gt(tokenBBalanceBefore);
  });
});
