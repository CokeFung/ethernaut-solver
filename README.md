# ethernaut-solver
Solving ethernaut with fully using ethers or web3 JS (no more remixd)

## Note
### create test script template
1. Navigate to project's root directory 
2. Execute the following command
    `python3 python3 create-test-script.py`
3. Copy the script config to `package.json`
### example test command
- testing on local network
    `npm run-script example-vuln`
- testing on specify network
     `npm run-script example-vuln -- --network goerli`
### warning
please verify the dependencies' version in `package.js` before compile contracts

### step to exploit
1. change challenge name [L:4]
2. change contract name [L:16,22]
3. write your exploiting script in `Exploit`

### Solution 
- [x]  Hello Ethernaut
- [x]  Fallback
- [ ]  Fallout
- [ ]  Coin Flip
- [ ]  Telephone
- [ ]  Token
- [ ]  Delegation
- [ ]  Force
- [ ]  Vault
- [ ]  King
- [ ]  Re-entrancy
- [ ]  Elevator
- [ ]  Privacy
- [ ]  Gatekeeper One
- [ ]  Gatekepper Two
- [ ]  Naught Coin
- [ ]  Preservation
- [ ]  Recovery
- [ ]  MagicNumber
- [ ]  Alien Codex
- [ ]  Denial
- [ ]  Shop
- [ ]  Dex
- [ ]  Dex Two
- [ ]  Puzzle Wallet
- [ ]  Motorbike
- [ ]  DoubleEntryPoint
- [ ]  Good Samaritan
