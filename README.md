# Ethernaut Solver (Hardhat)
Solving ethernaut by using Hardhat (with ethers.js)

## Unsolved Template
for those who need a template for solving ethernaut, I have created an `unsolved` branch for ya.
you can copy the template and do whatever you want (for learning only).

## Note
### create test script template and README file for new levels
0. Add new levels to `contracts` directory
1. Navigate to project's root directory 
2. Execute the following command
    `python3 create-template.py`
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
- [x]  [Hello Ethernaut](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/hello-ethernaut)
- [x]  [Fallback](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/fallback)
- [x]  [Fallout](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/fallout)
- [x]  [Coin Flip](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/coin-flip)
- [x]  [Telephone](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/telephone)
- [x]  [Token](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/token)
- [x]  [Delegation](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/delegation)
- [x]  [Force](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/force)
- [x]  [Vault](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/vault)
- [x]  [King](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/king)
- [x]  [Re-entrancy](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/re-entrancy)
- [x]  [Elevator](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/elevator)
- [x]  [Privacy](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/privacy)
- [x]  [Gatekeeper One](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/gatekeeper-one)
- [x]  [Gatekepper Two](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/gatekeeper-two)
- [x]  [Naught Coin](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/naught-coin)
- [x]  [Preservation](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/preservation)
- [x]  [Recovery](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/recovery)
- [ ]  MagicNumber (I just skipped it:)
- [x]  [Alien Codex](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/alien-codex)
- [x]  [Denial](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/denial)
- [x]  [Shop](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/shop)
- [x]  [Dex](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/dex)
- [x]  [Dex Two](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/dex-two)
- [x]  [Puzzle Wallet](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/puzzle-wallet)
- [x]  [Motorbike](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/motorbike)
- [x]  [DoubleEntryPoint](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/double-entry-point)
- [x]  [Good Samaritan](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/good-samaritan)
- [x]  [Gatekeeper Three](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/gatekeeper-three)