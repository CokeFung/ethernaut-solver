# Ethernaut Solver (Hardhat)
Solving ethernaut by using Hardhat (with ethers.js)

## Note
### create test script template
0. Add new levels to `contracts` directory
1. Navigate to project's root directory 
2. Execute the following command
    `python3 python3 create-test-script.py`
3. Copy the script config to `package.json`, and place it in the `scripts` section

### RPC serevr address
personally recommended : https://alchemy.com/

### example executing command
- executing on local network
    `npm run-script example-vuln`
- executing on specified network
     `npm run-script example-vuln -- --network goerli`
### warning
please verify the dependencies' version in `package.js` before compile contracts

### steps to exploit
1. change info follow the level in `before`
    - change challenge name [L:4]
    - change contract name [L:16,22]
3. write your exploiting script in `it(Exploit)`
4. write the solved conditions follow the level in `after` 

### solutions
- [ ]  Hello Ethernaut
- [ ]  Fallback
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
- [ ]  Gatekeeper Three