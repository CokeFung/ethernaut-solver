// SPDX-License-Identifier: MIT
pragma solidity <0.7.0;

contract EngineDestroyer {
    
    function destroy() public {
        address payable to = msg.sender;
        selfdestruct(to);
    }
}