const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Hello Ethernaut', () => {

    let deployer, attacker;
 
    before(async () => {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Instance');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Instance', deployer);
            this.target = await ContractFactory.deploy("s3cur3P@ssw0rd!!");
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        
    }).timeout(0);

    after(async () => {
         /** SUCCESS CONDITIONS */
        let cleared = await this.target.getCleared();
        expect(cleared).to.be.eq(true);
    });
    
});