// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./TokanA.sol";
import "./TokanB.sol";

contract SimpleLiquidityPool {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    event LiquidityAdded(
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );
    event LiquidityRemoved(
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );
    event TokenSwapped(
        address indexed trader,
        address inputToken,
        uint256 inputAmount,
        uint256 outputAmount
    );

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    // Add liquidity to the pool
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(
            amountA > 0 && amountB > 0,
            "Amounts must be greater than zero"
        );

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    // Remove liquidity from the pool
    function removeLiquidity(uint256 share) external {
        require(share > 0, "Share must be greater than zero");

        uint256 amountA = (reserveA * share) / 1e18;
        uint256 amountB = (reserveB * share) / 1e18;

        require(amountA > 0 && amountB > 0, "Insufficient liquidity");

        reserveA -= amountA;
        reserveB -= amountB;

        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    // Swap tokens
    function swap(address inputToken, uint256 inputAmount) external {
        require(inputAmount > 0, "Input amount must be greater than zero");
        require(
            inputToken == address(tokenA) || inputToken == address(tokenB),
            "Invalid input token"
        );

        bool isTokenA = inputToken == address(tokenA);
        IERC20 input = isTokenA ? tokenA : tokenB;
        IERC20 output = isTokenA ? tokenB : tokenA;

        uint256 inputReserve = isTokenA ? reserveA : reserveB;
        uint256 outputReserve = isTokenA ? reserveB : reserveA;

        uint256 inputAmountWithFee = (inputAmount * 997) / 1000; // 0.3% fee
        uint256 outputAmount = (inputAmountWithFee * outputReserve) /
            (inputReserve + inputAmountWithFee);

        require(outputAmount > 0, "Insufficient output amount");

        input.transferFrom(msg.sender, address(this), inputAmount);
        output.transfer(msg.sender, outputAmount);

        if (isTokenA) {
            reserveA += inputAmount;
            reserveB -= outputAmount;
        } else {
            reserveB += inputAmount;
            reserveA -= outputAmount;
        }

        emit TokenSwapped(msg.sender, inputToken, inputAmount, outputAmount);
    }
}
