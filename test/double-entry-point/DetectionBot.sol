// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDetectionBot {
    function handleTransaction(address user, bytes calldata msgData) external;
}

interface IForta {
    function raiseAlert(address user) external;
}

contract DetectionBot is IDetectionBot {

    address player;
    IForta forta;
    address vault;
    IERC20 det;

    constructor(address _player, IForta _forta, address _vault, IERC20 _det){
        player = _player;
        forta = _forta;
        vault = _vault;
        det = _det;
    }

    function handleTransaction(address user, bytes calldata msgData) external override {
        address _to;
        uint256 _value;
        address _sender;
        if(user == player){
            (, _to, _value, _sender) = abi.decode(
                abi.encodePacked(bytes28(0), msgData), // pad first 4 bytes to 32 bytes and ignore it.
                (bytes32,address,uint256,address)
            );
        }
        if (_sender == vault && det.balanceOf(_sender) == _value) {
            forta.raiseAlert(player);
        }
    }
}

//thanks for decoding mechanism: https://github.com/ethereum/solidity/issues/6012