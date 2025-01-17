// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("TokenModule", (m) => {
  
  const tokenA = m.contract("TokenA");

  const tokenB = m.contract("TokenB");

  return { tokenA,tokenB };
  // console.log(tokenA.address, tokenB.address);
  
});
