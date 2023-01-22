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
- [ ]  [Hello Ethernaut](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/hello-ethernaut)
- [ ]  [Fallback](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/fallback)
- [ ]  [Fallout](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/fallout)
- [ ]  [Coin Flip](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/coin-flip)
- [ ]  [Telephone](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/telephone)
- [ ]  [Token](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/token)
- [ ]  [Delegation](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/delegation)
- [ ]  [Force](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/force)
- [ ]  [Vault](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/vault)
- [ ]  [King](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/king)
- [ ]  [Re-entrancy](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/re-entrancy)
- [ ]  [Elevator](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/elevator)
- [ ]  [Privacy](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/privacy)
- [ ]  [Gatekeeper One](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/gatekeeper-one)
- [ ]  [Gatekepper Two](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/gatekeeper-two)
- [ ]  [Naught Coin](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/naught-coin)
- [ ]  [Preservation](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/preservation)
- [ ]  [Recovery](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/recovery)
- [ ]  [MagicNumber](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/magic-number)
- [ ]  [Alien Codex](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/alien-codex)
- [ ]  [Denial](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/denial)
- [ ]  [Shop](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/shop)
- [ ]  [Dex](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/dex)
- [ ]  [Dex Two](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/dex-two)
- [ ]  [Puzzle Wallet](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/puzzle-wallet)
- [ ]  [Motorbike](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/motorbike)
- [ ]  [DoubleEntryPoint](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/double-entry-point)
- [ ]  [Good Samaritan](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/good-samaritan)
- [ ]  [Gatekeeper Three](https://github.com/CokeFung/ethernaut-solver-hardhat/tree/main/test/gatekeeper-three)