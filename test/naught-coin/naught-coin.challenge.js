const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] NaughtCoin', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('NaughtCoin');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('NaughtCoin', deployer);
            this.target = await ContractFactory.deploy(attacker.address);
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(parseInt(await this.target.balanceOf(attacker.address))).to.be.eq(0);
    });
});