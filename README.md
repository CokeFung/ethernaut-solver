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

### steps to exploit
1. change info follow the level in `before`
    - change challenge name [L:4]
    - change contract name [L:16,22]
3. write your exploiting script in `it(Exploit)`
4. write the solved conditions follow the level in `after` 

### Solution 
- [x]  Hello Ethernaut
- [x]  Fallback
- [x]  Fallout
- [x]  Coin Flip
- [x]  Telephone
- [x]  Token
- [x]  Delegation
- [x]  Force
- [x]  Vault
- [x]  King
- [x]  Re-entrancy
- [x]  Elevator
- [x]  Privacy
- [x]  Gatekeeper One
- [x]  Gatekepper Two
- [x]  Naught Coin
- [x]  Preservation
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
