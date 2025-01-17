// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("LiquidityModule", (m) => {

    tokanAaddress = "0x9281524DB9D6483bCFd72F63969aD3336aCa807c"
    
    tokanBaddress = "0x5Ba189D7B0f407A5878A94818585DbFFc18D0092"
  
  const liquidityPool = m.contract("SimpleLiquidityPool",[tokanAaddress, tokanBaddress]);



  return { liquidityPool };
});
