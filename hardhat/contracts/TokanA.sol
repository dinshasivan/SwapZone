
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20{
    constructor() ERC20('ATK','TokenA'){
        _mint(msg.sender, 2500 * 10**decimals()) ;
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}